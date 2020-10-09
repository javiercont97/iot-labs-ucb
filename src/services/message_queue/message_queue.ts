import { QueueClient } from "./interfaces/queue_client";


export class MessageQueue {
    public static wstt: QueueClient;
    public static mqtt: QueueClient;

    public static publishToMQTT(topic: string, message: object | string): void {
        this.mqtt.notify(topic, message);
    }

    public static publishToWSTT(topic: string, message: object | string): void {
        this.wstt.notify(topic, message);
    }
}