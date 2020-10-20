import { appLogger } from '../../config/constants';
import { exec } from 'child_process';
import Mailer from '../notification/mailer';
import { Extract as extractZIP } from 'unzipper';
import { createReadStream as zipReadStream, readdirSync as listItems } from 'fs';
import { resolve as resolvePath } from 'path';

// var sys = require('sys')
// var exec = require('child_process').exec;

// function puts(error, stdout, stderr) { sys.puts(stdout) }
// exec("ls -la", function(err, stdout, stderr) {
//   console.log(stdout);
// });

class DockerCompiler {
    /**
     * 
     * @param path Path to application folder. This should be the folder that contains .pro file and other Qt stuff
     */
    public static compile(path: string, app: string, appID: string, userMail: string, userName: string) {
        let qmake: string = `docker run --rm -v ${path}:/src/ -v ~/.emscripten_cache:/emsdk_portable/.data/cache -u $(id -u):$(id -g) madmanfred/qt-webassembly:qt5.15-em1.39.10 qmake`;
        let make: string = `docker run --rm -v ${path}:/src/ -v ~/.emscripten_cache:/emsdk_portable/.data/cache -u $(id -u):$(id -g) madmanfred/qt-webassembly:qt5.15-em1.39.10 make`;

        appLogger.verbose('WASM_COMPILING', 'Running qmake');
        exec(qmake, (err, stdout, stderr) => {
            if(err) {
                return;
            }
            appLogger.verbose('WASM_COMPILING', stdout);
            appLogger.error('WASM_COMPILING', stderr);
            appLogger.verbose('WASM_COMPILING', 'Running make');
            exec(make, (err, stdout, stderr) => {
                if(err) {
                    return;
                }
                appLogger.verbose('WASM_COMPILING', stdout);
                appLogger.error('WASM_COMPILING', stderr);
                appLogger.verbose('WASM_COMPILING', 'App finished building');
                Mailer.sendNotificationEmail(userMail, userName, app, appID);

                zipReadStream(resolvePath(__dirname, `../../../assets/qtlogo.zip`))
                    .pipe(extractZIP({ path: resolvePath(__dirname, `../../../app/${appID}`) }))
                    .promise()
                    .then(() => {

                    });
            });
        });
    }
}

export default DockerCompiler;