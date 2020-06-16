import { resolve } from 'path';
import { readFileSync } from 'fs';

import { ConsoleLogger } from "../services/logs/consoleLogger";
import { FileLogger } from "../services/logs/fileLogger";
import { Logger } from '../interfaces/logger';

// load config.json
const path = resolve('./config.json');
const SETTINGS = JSON.parse(readFileSync(path).toString());

// Server PORT
export const PORT = SETTINGS.server.PORT || 3000;

// Database
export const MONGO_URI = SETTINGS.server.MONGO_URI || `mongodb+srv://mainframe-db-user:ZHqusYryST8UNDBI@mainframe-db-3iycr.gcp.mongodb.net/mainframe`;

// Authentication and Authorization
export const SALT_SIZE = SETTINGS.security.SAL_SIZE || 15;

// Logger
export const DEBUG_LEVEL: Array<string> = SETTINGS.debugging.DEBUG_LEVEL || [];

function loggerCreator(): Logger {
    if (SETTINGS.debugging.DEBUGGING_METHOD == undefined) {
        return new ConsoleLogger();
    } else {
        if (SETTINGS.debugging.DEBUGGING_METHOD == 'Console') {
            return new ConsoleLogger();
        } else {
            if (SETTINGS.debugging.DEBUGGING_METHOD == 'File') {
                return new FileLogger();
            } else {
                return new ConsoleLogger();
            }
        }
    }
}

// Utils
export const HOST_URL = `${SETTINGS.server.HOST_URL}:${PORT}` || `http://localhost:${PORT}`

export const appLogger = loggerCreator();