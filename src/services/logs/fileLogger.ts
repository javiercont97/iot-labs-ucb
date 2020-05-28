import { Logger } from "../../interfaces/logger";
import { DEBUG_LEVEL } from "../../config/constants";

import { createWriteStream, WriteStream } from 'fs';
import { resolve } from 'path';

export class FileLogger implements Logger {
    private infoLogFile: WriteStream;
    private errorLogFile: WriteStream;
    private debugLogFile: WriteStream;

    constructor () {
        let infoPath = resolve(`log/${new Date().toLocaleString().split(' ')[0]}-Info.txt`);
        let errorPath = resolve(`log/${new Date().toLocaleString().split(' ')[0]}-Error.txt`);
        let debugPath = resolve(`log/${new Date().toLocaleString().split(' ')[0]}-Debug.txt`);

        this.infoLogFile = createWriteStream( infoPath , { flags: 'a' });
        this.errorLogFile = createWriteStream( errorPath , { flags: 'a' });
        this.debugLogFile = createWriteStream( debugPath , { flags: 'a' });
    }

    public info(topic: string, information: string): void {
        this.infoLogFile.write(`${topic} [${new Date().toLocaleString()}]:\t${information}\n`);
    }
    public error(topic: string, errorCode: string, errorMessage: string): void {
        this.errorLogFile.write(`${topic} [${new Date().toLocaleString()}] (Error Code:${errorCode}):\t${errorMessage}\n`);
    }
    public debug(topic: string, debugLevel: string, debugInformation: string): void {
        if(debugLevel <= DEBUG_LEVEL) {
            this.debugLogFile.write(`${topic} [${new Date().toLocaleString()}] (Debug level ${debugLevel}):\t${debugInformation}\n`);
        }
    }
}