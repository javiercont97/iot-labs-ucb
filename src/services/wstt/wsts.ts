import { appLogger } from '../../config/constants';


class WSTelemtryServer {

    constructor() {
        appLogger.verbose('WSTT', 'Setup initialization');

        this.setUpConnection();
    }

    private setUpConnection(): void {
        appLogger.verbose('WSTT', 'Setup WSTT service');
    }
}

export default WSTelemtryServer;