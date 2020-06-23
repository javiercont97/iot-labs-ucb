import { appLogger } from '../../config/constants';
import WebSocket = require('ws');
import WSTT_Client from './controllers/peerController';
import { KQueue } from './controllers/channelController';


class WSTelemtryServer extends WebSocket.Server {
    clientList: Array<WSTT_Client> = [];
    queue: KQueue;

    constructor (config: WebSocket.ServerOptions) {
        super(config);
        appLogger.verbose('WSTT', 'WSTT Server initialization');
    }

    public setupWSTT_Server(): void {
        this.queue = KQueue.Instance;
        this.on('connection', this.onConnection);
    }

    private onConnection = ( socket: WebSocket ) => {
        let client = new WSTT_Client(socket);
        this.clientList.push(client);
        client.on('broadcast', this.onBroadCast);
        client.on('closeConnection', this.onDisconnection);
        client.on('subscribe', this.onSubscribe);
        appLogger.verbose('WSTT', `New client connected. Client count: ${this.clientList.length}`);
    }

    private onDisconnection = ( disconnectedClient: WSTT_Client ) => {
        this.queue.removeConsumer(disconnectedClient);
        this.clientList = this.clientList.filter( (client: WSTT_Client) => {
            return client != disconnectedClient;
        });
        appLogger.verbose('WSTT', `Client disconected. Client count: ${this.clientList.length}`);
    }

    private onBroadCast = (appID: string, topic: string, message: any) => {
        this.queue.publish(appID, topic, message);
    }
    
    private onSubscribe = (appID: string, topic: string, consumer: WSTT_Client) => {
        this.queue.subscribe(appID, topic, consumer);
    }
}

export default WSTelemtryServer;