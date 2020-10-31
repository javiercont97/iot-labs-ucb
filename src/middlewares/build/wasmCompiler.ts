import { appLogger } from '../../config/constants';
import { exec } from 'child_process';
import Mailer from '../notification/mailer';
import { Extract as extractZIP } from 'unzipper';
import { createReadStream as zipReadStream, readdirSync as listItems } from 'fs';
import { resolve as resolvePath } from 'path';

import { EventEmitter } from 'events' ;

class DockerCompiler extends EventEmitter {
    private cpus: number;
    public busy: boolean;

    constructor (cpus: number) {
        super();
        this.cpus = cpus;
        this.busy = false;
        appLogger.verbose('COMPILER_WORKER', `Worker for compilation setup with ${cpus} cores`);
    }

    /**
     * 
     * @param path Path to application folder. This should be the folder that contains .pro file and other Qt stuff
     */
    public compile(path: string, app: string, appID: string, userMail: string, userName: string) {
        this.busy = true;

        let qmake: string = `docker run --rm -v ${path}:/src/ -v ~/.emscripten_cache:/emsdk_portable/.data/cache -u $(id -u):$(id -g) madmanfred/qt-webassembly:qt5.15-em1.39.10 qmake`;
        let make: string = `docker run --rm --cpus="${this.cpus}" -v ${path}:/src/ -v ~/.emscripten_cache:/emsdk_portable/.data/cache -u $(id -u):$(id -g) madmanfred/qt-webassembly:qt5.15-em1.39.10 make`;

        appLogger.verbose('COMPILER_WORKER', 'Running qmake');
        exec(qmake, (err, stdout, stderr) => {
            if(err) {
                appLogger.error('COMPILER_WORKER', stderr);
                return;
            }
            appLogger.verbose('COMPILER_WORKER', stdout);
            appLogger.verbose('COMPILER_WORKER', 'Running make');
            exec(make, (err, stdout, stderr) => {
                if(err) {
                    appLogger.error('COMPILER_WORKER', stderr);
                    return;
                }
                appLogger.verbose('COMPILER_WORKER', stdout);
                appLogger.verbose('COMPILER_WORKER', 'App finished building');
                Mailer.sendNotificationEmail(userMail, userName, app, appID);

                zipReadStream(resolvePath(__dirname, `../../../assets/qtlogo.zip`))
                    .pipe(extractZIP({ path: resolvePath(__dirname, `../../../app/${appID}`) }))
                    .promise()
                    .then(() => {
                        this.busy = false;
                        this.emit('jobsdone', this);
                    });
            });
        });
    }
}

export default DockerCompiler;