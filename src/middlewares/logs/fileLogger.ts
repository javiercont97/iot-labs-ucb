import { Logger } from "../../interfaces/logger";
import { DEBUG_LEVEL } from "../../config/constants";

import { createWriteStream, WriteStream } from 'fs';
import { resolve } from 'path';

export class FileLogger implements Logger {
    private verboseLogFile: WriteStream;
    private infoLogFile: WriteStream;
    private warningLogFile: WriteStream;
    private errorLogFile: WriteStream;

    constructor () {
        let verbosePath = resolve(`log/VerbosePath.txt`);
        let infoPath = resolve(`log/Info.txt`);
        let warningPath = resolve(`log/Warning.txt`);
        let errorPath = resolve(`log/Error.txt`);

        this.verboseLogFile = createWriteStream( verbosePath , { flags: 'a' });
        this.infoLogFile = createWriteStream( infoPath , { flags: 'a' });
        this.warningLogFile = createWriteStream( warningPath , { flags: 'a' });
        this.errorLogFile = createWriteStream( errorPath , { flags: 'a' });
    }

    /**
     * Writes message to verbose file
     * @param topic Topic
     * @param message Verbose message
     */
    public verbose(topic: string, message: string): void {
        if(DEBUG_LEVEL.includes('verbose')) {
            this.verboseLogFile.write(`[${new Date().toLocaleString()}, ${topic}]: \"${message}\"\n`);
        }
    }

    /**
     * Writes message to info file
     * @param topic Topic
     * @param message Info message
     */
    public info(topic: string, message: string): void {
        if(DEBUG_LEVEL.includes('info')) {
            this.infoLogFile.write(`[${new Date().toLocaleString()}, ${topic}]: \"${message}\"\n`);
        }
    }
    
    /**
     * Writes message to warning file
     * @param topic Topic
     * @param message Warning message
     */
    public warning(topic: string, message: string): void {
        if(DEBUG_LEVEL.includes('warning')) {
            this.warningLogFile.write(`[${new Date().toLocaleString()}, ${topic}]: \"${message}\"\n`);
        }
    }

    /**
     * Writes message to error file
     * @param topic Topic
     * @param message Error message
     */
    public error(topic: string, message: string): void {
        if(DEBUG_LEVEL.includes('error')) {
            this.errorLogFile.write(`[${new Date().toLocaleString()}, ${topic}]: \"${message}\"\n`);
        }
    }
}