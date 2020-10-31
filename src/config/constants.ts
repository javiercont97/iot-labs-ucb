import { resolve } from 'path';
import { readFileSync } from 'fs';

import { ConsoleLogger } from "../middlewares/logs/consoleLogger";
import { FileLogger } from "../middlewares/logs/fileLogger";
import { Logger } from '../interfaces/logger';

// load config.json
const path = resolve('./config.json');
const SETTINGS = JSON.parse(readFileSync(path).toString());

// Server
export const PORT = SETTINGS.server.PORT || 3000;
export const HOST_URL = `${SETTINGS.server.HOST_URL}:${PORT}` || `http://localhost:${PORT}`

// Database
export const MONGO_URI = SETTINGS.server.MONGO_URI || `mongodb://admin@localhost/mainframe`;

// Authentication and Authorization
export const SALT_SIZE = SETTINGS.security.SALT_SIZE || 15;
export const API_KEY_SIZE = SETTINGS.security.API_KEY_SIZE || 32;
export const SESSION_IV: string = SETTINGS.security.SESSION_IV || "0123456789abcdef";

// Services
export const PING_FREQ = SETTINGS.services.WSTT.PING_FREQ || 500;
export const MQTT_PORT = SETTINGS.services.MQTT.MQTT_PORT || 1883;
export const AMMOUNT_OF_COMPILATION_WORKERS = SETTINGS.services.GUEST_APPS.AMMOUNT_OF_COMPILATION_WORKERS || 1;
export const CPUS_PER_WORKER = SETTINGS.services.GUEST_APPS.CPUS_PER_WORKER || 1;


// File uploads
export const ALLOWED_EXTENTIONS: Array<string> = SETTINGS.file_uploads.ALLOWED_EXTENTIONS || ['zip'];
export const MAX_FILE_SIZE = SETTINGS.file_uploads.MAX_FILE_SIZE || 10;

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
export const appLogger = loggerCreator();
