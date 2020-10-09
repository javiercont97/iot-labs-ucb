import { appLogger } from '../../config/constants';
import WebSocket = require('ws');
import WSTT_Client from './controllers/peerController';
import { KQueue } from './controllers/channelController';
import { QueueClient } from '../message_queue/interfaces/queue_client';
import { MessageQueue } from '../message_queue/message_queue';


class WSTelemtryServer extends WebSocket.Server implements QueueClient{
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

    private onBroadCast = (topic: string, message: any) => {
        this.queue.publish(topic, message);
        this.publish(topic, message);
    }
    
    private onSubscribe = (topic: string, consumer: WSTT_Client) => {
        this.queue.subscribe(topic, consumer);
    }

    /**
     * QueueClient interface
     */
    publish(topic: string, message: string | object): void {
        MessageQueue.publishToMQTT(topic, message);
    }
    notify(topic: string, message: string | object): void {
        this.queue.publish(topic, message);
    }
}

export default WSTelemtryServer;