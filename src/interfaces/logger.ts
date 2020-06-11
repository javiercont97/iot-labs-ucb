

export interface Logger {
    /**
     * Logs verbose messages
     * @param topic Topic
     * @param message Verbose message
     */
    verbose(topic: string, message: string): void;

    /**
     * Logs info messages
     * @param topic Topic
     * @param information Info message
     */
    info(topic: string, information: string): void;
    
    /**
     * Logs warning messages
     * @param topic Topic
     * @param warning Warning message
     */
    warning(topic: string, warning: string): void;

    /**
     * Logs error messages
     * @param topic Topic
     * @param error Error message
     */
    error(topic: string, error: string): void;
}