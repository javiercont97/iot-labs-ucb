import { AMMOUNT_OF_COMPILATION_WORKERS, appLogger, CPUS_PER_WORKER } from "../../config/constants";
import DockerCompiler from "./wasmCompiler";


export class CompilationQueue {
    private static tasks: Array<{path: string, app: string, appID: string, userMail: string, userName: string}> = [];
    private static workers: Array<DockerCompiler> = [];

    public static init (): void {
        appLogger.verbose('WASK_COMPILER_QUEUE', `Init worker pool for WASM compilation with ${AMMOUNT_OF_COMPILATION_WORKERS} workers`);
        for (let i = 0 ; i < AMMOUNT_OF_COMPILATION_WORKERS ; i++) {
            let worker = new DockerCompiler(CPUS_PER_WORKER);
            this.workers.push(worker);
            this.tasks = [];

            worker.on('jobsdone', (worker: DockerCompiler) => {
                if(!worker.busy) {
                    if(this.tasks.length > 0) {
                        let work = this.tasks.pop();
                        worker.compile(work.path, work.app, work.appID, work.userMail, work.userName);
                    }
                }
            });
        }
    }

    private static checkIfJobsAvailable(): void {
        appLogger.verbose('WASK_COMPILER_QUEUE', 'Asign job');

        this.workers.forEach(currentWorker => {
            if(!currentWorker.busy) {
                if(this.tasks.length > 0) {
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
        this.tasks.push({
            path,
            app,
            appID,
            userMail,
            userName
        });

        this.checkIfJobsAvailable();
    }
}
