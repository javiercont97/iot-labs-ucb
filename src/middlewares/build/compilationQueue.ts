import { AMMOUNT_OF_COMPILATION_WORKERS, appLogger, CPUS_PER_WORKER } from "../../config/constants";
import DockerCompiler from "./wasmCompiler";
import {Mutex} from 'async-mutex';

// let pending: Array<{path: string, app: string, appID: string, userMail: string, userName: string}> = [
//     {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3db1b8bfff7af800d4a0e',
//         app: 't1',
//         appID: '60b3db1b8bfff7af800d4a0e',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3db218bfff7af800d4a0f',
//         app: 't2',
//         appID: '60b3db218bfff7af800d4a0f',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3db2c8bfff7af800d4a10',
//         app: 't3',
//         appID: '60b3db2c8bfff7af800d4a10',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3db348bfff7af800d4a11',
//         app: 't4',
//         appID: '60b3db348bfff7af800d4a11',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3db398bfff7af800d4a12',
//         app: 't5',
//         appID: '60b3db398bfff7af800d4a12',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3db458bfff7af800d4a13',
//         app: 't6',
//         appID: '60b3db458bfff7af800d4a13',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3db528bfff7af800d4a14',
//         app: 't7',
//         appID: '60b3db528bfff7af800d4a14',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3db598bfff7af800d4a15',
//         app: 't8',
//         appID: '60b3db598bfff7af800d4a15',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3db608bfff7af800d4a16',
//         app: 't9',
//         appID: '60b3db608bfff7af800d4a16',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3db678bfff7af800d4a17',
//         app: 't10',
//         appID: '60b3db678bfff7af800d4a17',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3db6f8bfff7af800d4a18',
//         app: 't11',
//         appID: '60b3db6f8bfff7af800d4a18',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3db7a8bfff7af800d4a19',
//         app: 't12',
//         appID: '60b3db7a8bfff7af800d4a19',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3db858bfff7af800d4a1a',
//         app: 't13',
//         appID: '60b3db858bfff7af800d4a1a',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3db958bfff7af800d4a1b',
//         app: 't14',
//         appID: '60b3db958bfff7af800d4a1b',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3db9e8bfff7af800d4a1c',
//         app: 't15',
//         appID: '60b3db9e8bfff7af800d4a1c',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3dba68bfff7af800d4a1d',
//         app: 't16',
//         appID: '60b3dba68bfff7af800d4a1d',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3dbb08bfff7af800d4a1e',
//         app: 't17',
//         appID: '60b3dbb08bfff7af800d4a1e',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3dbb98bfff7af800d4a1f',
//         app: 't18',
//         appID: '60b3dbb98bfff7af800d4a1f',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3dbc38bfff7af800d4a20',
//         app: 't19',
//         appID: '60b3dbc38bfff7af800d4a20',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }, {
//         path: 'D:\\Javier\\UCB\\Proyecto\\Mainframe\\platform\\mainframe-core\\app\\60b3dbca8bfff7af800d4a21',
//         app: 't20',
//         appID: '60b3dbca8bfff7af800d4a21',
//         userMail: 'javierconts3@live.com',
//         userName: 'Xavi'
//     }
// ]

export class CompilationQueue {
    private static tasks: Array<{path: string, app: string, appID: string, userMail: string, userName: string}> = [];
    private static workers: Array<DockerCompiler> = [];
    private static mutex: Mutex;

    public static init (): void {
        appLogger.info('WASM_COMPILER_QUEUE', `Init worker pool for WASM compilation with ${AMMOUNT_OF_COMPILATION_WORKERS} workers`);
        this.mutex = new Mutex();

        for (let i = 0 ; i < AMMOUNT_OF_COMPILATION_WORKERS ; i++) {
            let worker = new DockerCompiler(CPUS_PER_WORKER);
            this.workers.push(worker);
            this.tasks = [];

            worker.on('jobsdone', (worker: DockerCompiler) => {
                this.mutex.acquire()
                .then( release => {
                    appLogger.verbose('WASM_COMPILER_QUEUE', 'Job\'s finished');
                    if(!worker.busy) {
                        if(this.tasks.length > 0) {
                            appLogger.verbose('WASM_COMPILER_QUEUE', 'Asign job');
                            // let work = this.tasks.pop();
                            let work = this.tasks.shift();
                            worker.compile(work.path, work.app, work.appID, work.userMail, work.userName);
                        }
                    }
                    release();
                });
            });
        }
    }

    private static checkIfJobsAvailable(): void {
        appLogger.verbose('WASM_COMPILER_QUEUE', 'Checking if any job is available');
        this.workers.forEach(currentWorker => {
            if(!currentWorker.busy) {
                if(this.tasks.length > 0) {
                    appLogger.verbose('WASM_COMPILER_QUEUE', 'Asign job');
                    // let work = this.tasks.pop();
                    let work = this.tasks.shift();
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
