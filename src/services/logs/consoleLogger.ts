import { Logger } from "../../interfaces/logger";
import { DEBUG_LEVEL } from "../../config/constants";

enum ConsoleFontColor {
    Reset = "\x1b[0m",
    Bright = "\x1b[1m",
    Dim = "\x1b[2m",
    Underscore = "\x1b[4m",
    Blink = "\x1b[5m",
    Reverse = "\x1b[7m",
    Hidden = "\x1b[8m",
    FgBlack = "\x1b[30m",
    FgRed = "\x1b[31m",
    FgGreen = "\x1b[32m",
    FgYellow = "\x1b[33m",
    FgBlue = "\x1b[34m",
    FgMagenta = "\x1b[35m",
    FgCyan = "\x1b[36m",
    FgWhite = "\x1b[37m",
    BgBlack = "\x1b[40m",
    BgRed = "\x1b[41m",
    BgGreen = "\x1b[42m",
    BgYellow = "\x1b[43m",
    BgBlue = "\x1b[44m",
    BgMagenta = "\x1b[45m",
    BgCyan = "\x1b[46m",
    BgWhite = "\x1b[47m"
}

export class ConsoleLogger implements Logger {
    /**
     * Writes verbose messages to the console:
     *  - Color: White
     * @param topic Topic
     * @param message Verbose message
     */
    public verbose(topic: string, message: string): void {
        if (DEBUG_LEVEL.includes('verbose')) {
            console.log(`${ConsoleFontColor.FgWhite}[${new Date().toLocaleString()}, ${topic}]: \"${message}\"${ConsoleFontColor.Reset}`);
        }
    }

    /**
     * Writes info messages to the console:
     *  - Color: Cyan
     * @param topic Topic
     * @param information Info message
     */
    public info(topic: string, message: string): void {
        if (DEBUG_LEVEL.includes('info')) {
            console.log(`${ConsoleFontColor.FgCyan}[${new Date().toLocaleString()}, ${topic}]: \"${message}\"${ConsoleFontColor.Reset}`);
        }
    }

    /**
     * Writes info messages to the console:
     *  - Color: Yellow
     * @param topic Topic
     * @param warning Warning message
     */
    public warning(topic: string, message: string): void {
        if (DEBUG_LEVEL.includes('warning')) {
            console.log(`${ConsoleFontColor.FgYellow}[${new Date().toLocaleString()}, ${topic}]: \"${message}\"${ConsoleFontColor.Reset}`);
        }
    }

    /**
     * Writes info messages to the console:
     *  - Color: Red
     * @param topic Topic
     * @param error Error message
     */
    public error(topic: string, message: string): void {
        if (DEBUG_LEVEL.includes('error')) {
            console.log(`${ConsoleFontColor.FgRed}[${new Date().toLocaleString()}, ${topic}]: \"${message}\"${ConsoleFontColor.Reset}`);
        }
    }
}