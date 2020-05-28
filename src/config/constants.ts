import { ConsoleLogger } from "../services/logs/consoleLogger";
import { FileLogger } from "../services/logs/fileLogger";

// Server PORT 
export const PORT = Number(process.env.PORT) || 3000;

// Database
export const MONGO_URI = `mongodb+srv://mainframe-db-user:ZHqusYryST8UNDBI@mainframe-db-3iycr.gcp.mongodb.net/test`;

// Authentication and Authorization
export const SALT_SIZE = Number(process.env.SALD_SIZE) || 25;

// Logger
/**
 * Debug levels:
 *  0: No debug
 *  1: App status
 *  2: API calls (functions called)
 *  3: Data given to API function
 */
export const DEBUG_LEVEL = '3';
export const appLogger = new ConsoleLogger();
// export const appLogger = new FileLogger();