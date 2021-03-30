import { AMMOUNT_OF_COMPILATION_WORKERS, appLogger, CPUS_PER_WORKER } from "../../config/constants";
import DockerCompiler from "./wasmCompiler";
import {Mutex} from 'async-mutex';

export class CompilationQueue {
    private static tasks: Array<{path: string, app: string, appID: string, userMail: string, userName: string}> = [];
    private static workers: Array<DockerCompiler> = [];
    private static mutex: Mutex;

    public static init (): void {
        appLogger.verbose('WASK_COMPILER_QUEUE', `Init worker pool for WASM compilation with ${AMMOUNT_OF_COMPILATION_WORKERS} workers`);
        this.mutex = new Mutex();


        for (let i = 0 ; i < AMMOUNT_OF_COMPILATION_WORKERS ; i++) {
            let worker = new DockerCompiler(CPUS_PER_WORKER);
            this.workers.push(worker);
            this.tasks = [];

            worker.on('jobsdone', (worker: DockerCompiler) => {
                this.mutex.acquire()
                .then( release => {
                    appLogger.verbose('WASK_COMPILER_QUEUE', 'Job\'s finished');
                    if(!worker.busy) {
                        if(this.tasks.length > 0) {
                            appLogger.verbose('WASK_COMPILER_QUEUE', 'Asign job');
                            let work = this.tasks.pop();
                            worker.compile(work.path, work.app, work.appID, work.userMail, work.userName);
                        }
                    }
                    release();
                });
            });
        }
    }

    private static checkIfJobsAvailable(): void {
        appLogger.verbose('WASK_COMPILER_QUEUE', 'Checking if any job is available');
        this.workers.forEach(currentWorker => {
            if(!currentWorker.busy) {
                if(this.tasks.length > 0) {
                    appLogger.verbose('WASK_COMPILER_QUEUE', 'Asign job');
                    let work = this.tasks.pop();
                    currentWorker.compile(work.path, work.app, work.appID, work.userMail, work.userName);
                }
            }
        });
    }

    /**
     * This method adds a task to the queue
     * @param path Compilation task path
     * @param app Target application name
     * @param appID Target application ID
     * @param userMail Owner email
     * @param userName Owner name
     */
    public static enqueueJob(path: string, app: string, appID: string, userMail: string, userName: string): void {
        this.mutex.acquire()
        .then( release => {
            this.tasks.push({
                path,
                app,
                appID,
                userMail,
                userName
            });
    
            this.checkIfJobsAvailable();
            release();
        });
    }
}
