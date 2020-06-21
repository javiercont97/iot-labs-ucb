import { appLogger } from '../../config/constants';
import WebSocket = require('ws');
import WSTT_Client from './interfaces/peer';


class WSTelemtryServer extends WebSocket.Server {
    clientList: Array<WSTT_Client> = [];

    constructor (config: WebSocket.ServerOptions) {
        super(config);
        appLogger.verbose('WSTT', 'WSTT Server initialization');
    }

    public setupWSTT_Server(): void {
        this.on('connection', this.onConnection);
    }

    private onConnection = ( socket: WebSocket ) => {
        appLogger.verbose('WSTT', `New client connected`);
        let client = new WSTT_Client(socket);
        this.clientList.push(client);
        client.on('broadcast', this.onBroadCast);
    }

    private onBroadCast = (sender: WSTT_Client, message: string) => {
        this.clientList.forEach((client: WSTT_Client) => {
            if(sender !== client) {
                client.sendMessage(message);
            }
        });
    }
}

export default WSTelemtryServer;