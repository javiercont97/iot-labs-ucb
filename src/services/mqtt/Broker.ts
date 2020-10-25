import mqtt = require('aedes');
import { appLogger, MQTT_PORT } from '../../config/constants';
import { createServer, Server } from 'net';
import { DB } from '../../interfaces/dbManager';
import { QueueClient } from '../message_queue/interfaces/queue_client';
import { MessageQueue } from '../message_queue/message_queue';

class Broker implements QueueClient {
    m_server: Server;
    m_broker: mqtt.Aedes;

    constructor() {
        this.m_broker = mqtt({
            authenticate: this.AuthenticateClient
        });

        this.m_broker.on('publish', (packet, client: mqtt.Client) => {
            if(!packet.topic.includes('$SYS')) {
                if(client !== null ) {
                    this.publish(packet.topic, packet.payload.toString());
                }
            }
        });
    }
    /**
     * QueueClient interface
     */
    publish(topic: string, message: string | object): void {
        MessageQueue.publishToWSTT(topic, message);
    }

    notify(topic: string, message: string | object): void {
        this.m_broker.publish({
            cmd: 'publish',
            qos: 2,
            dup: false,
            topic,
            payload: Buffer.from(message),
            retain: false
        }, err => {
            // appLogger.error('MQTT_BROKER', JSON.stringify(err));
        });
    }

    init(): void {
        this.m_server = createServer(this.m_broker.handle);

        this.m_server.listen(MQTT_PORT, () => {
            appLogger.info('MQTT_BROKER', `Broker started and listening on port ${MQTT_PORT}`);
        });
    }

    private AuthenticateClient(client: mqtt.Client, username: string, password: Buffer, callback: (err: mqtt.AuthenticateError, success: boolean) => void): void {
        if (!username || !password) {
            let err: any = new Error('No username or password provided');
            appLogger.error('MQTT_BROKER', 'No username or password provided');
            callback(err, false);
        } else {
            DB.Models.Device.findById(username, (err, deviceDB) => {
                if (err) {
                    appLogger.error('MQTT_BROKER', JSON.stringify(err));
                    let error: any = new Error(JSON.stringify(err));
                    callback(error, false);
                    return;
                }

                if (deviceDB === null) {
                    appLogger.error('MQTT_BROKER', 'No device was found');
                    let error: any = new Error('No device was found');
                    callback(error, false);
                    return;
                }

                if (deviceDB.apiKey !== password.toString()) {
                    appLogger.warning('MQTT_BROKER', 'Api key rejected');
                    let error: any = new Error('Api key rejected');
                    callback(error, false);
                    return;
                } else {
                    appLogger.verbose('MQTT_BROKER', `Client Connected (${username})`);
                    callback(null, true);
                }
            });
        }
    }
}

export default Broker;