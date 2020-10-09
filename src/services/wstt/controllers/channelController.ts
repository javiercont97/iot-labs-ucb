import { appLogger } from "../../../config/constants";
import WSTT_Client from "./peerController";


export class KQueue {
    private static _instance: KQueue;

    private channels = new Map<string, Array<WSTT_Client>>();

    private constructor() {
        appLogger.verbose('WSTT Queue', 'WS message queue created');
    }

    public static get Instance(): KQueue {
        if (KQueue._instance) {
            return KQueue._instance;
        } else {
            return new KQueue();
        }
    }

    public subscribe(topic: string, consumer: WSTT_Client): void {
        appLogger.verbose('WSTT Queue', `Subscribe to topic`);

        if (!this.channels.has(topic)) {
            // There is no channel for this app. Got to create
            appLogger.verbose('WSTT Queue', `Create topic`);
            this.channels.set(topic, []);
        }
        
        this.channels.get(topic).push(consumer);
    }
    
    public publish(topic: string, message: any): void {
        appLogger.verbose('WSTT Queue', `Publish message`);

        if(!this.channels.has(topic)) {
            // There is no channel for this app. Got to create
            appLogger.verbose('WSTT Queue', `Create topic`);
            this.channels.set(topic, []);
        }
        
        this.channels.get(topic).forEach( consumer => {
            consumer.sendMessage({
                topic,
                message
            });
        });
    }

    public removeConsumer(consumerToRemove: WSTT_Client): void {
        // can be optimized using appID instead of removing from everything
        appLogger.verbose('WSTT Queue', 'Removing consumer');

        let topics = this.channels.keys();

        for(let i = 0 ;i< this.channels.size;i++) {
            let currentTopic = topics.next().value;
            let clients = this.channels.get(currentTopic).filter(client => {
                return client != consumerToRemove;
            });
            this.channels.set(currentTopic, clients);

            appLogger.verbose('WSTT Queue', `Client unsubscribed from ${currentTopic}. Client count: ${this.channels.size}`);
        }
    }
}