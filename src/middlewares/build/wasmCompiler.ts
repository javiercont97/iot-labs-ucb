import { appLogger } from '../../config/constants';
import { exec } from 'child_process';
import Mailer from '../notification/mailer';



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
        let qmake: string = `docker run --rm -v ${path}:/src/ -v ~/.emscripten_cache:/emsdk_portable/.data/cache -u $(id -u):$(id -g) madmanfred/qt-webassembly qmake`;
        let make: string = `docker run --rm -v ${path}:/src/ -v ~/.emscripten_cache:/emsdk_portable/.data/cache -u $(id -u):$(id -g) madmanfred/qt-webassembly make`;

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
            });
        });
    }
}

export default DockerCompiler;