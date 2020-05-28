

export interface Logger {
    info(topic: string, information: string): void;
    error(topic: string, errorCode: string, errorMessage: string): void;
    debug(topic: string, debugLevel: string, debugInformation: string): void;
}