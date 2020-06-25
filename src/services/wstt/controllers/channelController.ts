import { KTopic } from "../interfaces/topic";
import { appLogger } from "../../../config/constants";
import WSTT_Client from "./peerController";


export class KQueue {
    private static _instance: KQueue;

    private channels = new Map<String, KTopic>();
    // this.channels.get('app').topics.get('topic').forEach( consumer => {
    //     // stuff
    // });

    private constructor() {
        appLogger.verbose('WSTT Queue', 'Message queue created');
    }

    public static get Instance(): KQueue {
        if (KQueue._instance) {
            return KQueue._instance;
        } else {
            return new KQueue();
        }
    }

    public subscribe(appID: string, topic: string, consumer: WSTT_Client): void {
        appLogger.verbose('WSTT Queue', `Subscribe to topic`);

        if (!this.channels.has(appID)) {
            // There is no channel for this app. Got to create
            appLogger.verbose('WSTT Queue', `Create app channel`);
            this.channels.set(appID, {
                topics: []
            });
        }

        let topicIndex = this.channels.get(appID).topics.findIndex(auxTopic => {
            return auxTopic.key == topic;
        });
        if (topicIndex < 0) {
            // App channel does not have this topic. Then create one
            appLogger.verbose('WSTT Queue', `Create topic`);
            this.channels.get(appID).topics.push({
                key: topic,
                consumers: []
            });
        }

        let subsTopicIndex = this.channels.get(appID).topics.findIndex(auxTopic => {
            return auxTopic.key == topic;
        });
        this.channels.get(appID).topics[subsTopicIndex].consumers.push(consumer);
    }
    
    public publish(appID: string, topic: string, message: any): void {
        appLogger.verbose('WSTT Queue', `Publish message`);

        if(!this.channels.has(appID)) {
            // There is no channel for this app. Got to create
            appLogger.verbose('WSTT Queue', `Create app channel`);
            this.channels.set(appID, {
               topics: []
            });
        }

        let topicIndex = this.channels.get(appID).topics.findIndex(auxTopic => {
            return auxTopic.key == topic;
        });
        if (topicIndex < 0) {
            // App channel does not have this topic. Then create one
            appLogger.verbose('WSTT Queue', `Create topic`);
            this.channels.get(appID).topics.push({
                key: topic,
                consumers: []
            });
        }

        let subsTopicIndex = this.channels.get(appID).topics.findIndex(auxTopic => {
            return auxTopic.key == topic;
        });
        
        this.channels.get(appID).topics[subsTopicIndex].consumers.forEach( consumer => {
            consumer.sendMessage({
                topic,
                targetApp: appID,
                message
            });
        });
    }

    public removeConsumer(consumerToRemove: WSTT_Client): void {
        // can be optimized using appID instead of removing from everything
        appLogger.verbose('WSTT Queue', 'Removing consumer');

        this.channels.forEach((app: KTopic) => {

            app.topics.forEach( topic => {
                topic.consumers = topic.consumers.filter(consumer => {
                    return consumer != consumerToRemove
                });

                appLogger.verbose('WSTT Queue', `Client unsubscribed from ${topic.key}. Consumer count: ${topic.consumers.length}`);
            });

            app.topics = app.topics.filter( topic => {
                if(topic.consumers.length == 0) {
                    appLogger.verbose('WSTT Queue', `Topic ${topic.key} has no consumer. Removing topic`);
                }
                return topic.consumers.length != 0;
            });
        });
    }
}