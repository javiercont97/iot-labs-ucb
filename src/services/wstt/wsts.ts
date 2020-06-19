import { Server, ServerOptions } from 'ws';
import { appLogger } from '../../config/constants';


class WSTelemtryServer {
    private ws: Server;
    private static Server: WSTelemtryServer;

    private constructor(config: ServerOptions) {
        this.ws = new Server(config);

    }

    public static get Instance(): WSTelemtryServer {
        if(WSTelemtryServer.Server) {
            appLogger.verbose('WSTS', 'Using instance');
            return WSTelemtryServer.Server;
        }
        appLogger.verbose('WSTS', 'New instance created');
        return new WSTelemtryServer({});
    }
}

export default WSTelemtryServer;