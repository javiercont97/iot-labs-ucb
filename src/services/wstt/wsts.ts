import { appLogger } from '../../config/constants';
import WebSocket = require('ws');
import WSTT_Client from './controllers/peerController';


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
        let client = new WSTT_Client(socket);
        this.clientList.push(client);
        client.on('broadcast', this.onBroadCast);
        client.on('closeConnection', this.onDisconnection);
        appLogger.verbose('WSTT', `New client connected. Client count: ${this.clientList.length}`);
    }

    private onDisconnection = ( disconnectedClient: WSTT_Client ) => {
        this.clientList = this.clientList.filter( (client: WSTT_Client) => {
            return client != disconnectedClient;
        });
        appLogger.warning('WSTT', `Client disconected. Client count: ${this.clientList.length}`);
    }

    private onBroadCast = (sender: WSTT_Client, topic: string, message: string | any, senderID: string) => {
        this.clientList.forEach((client: WSTT_Client) => {
            if(sender !== client) {
                client.sendMessage(message);
            }
        });
    }
}

export default WSTelemtryServer;