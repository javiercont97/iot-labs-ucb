
export interface QueueClient {
    /**
     * QueueClient.pulish(topic, message) is used to call Queue.publish method
     * @param topic Message topic to the one we're publishing
     * @param message Message object or string
     */
    publish(topic: string, message: object | string): void;

    /**
     * QueueClient.Notify(topic, message) is used to capture notifications
     * @param topic Topic to be notified from
     * @param message Message object or string
     */
    notify(topic: string, message: object | string): void;
}
