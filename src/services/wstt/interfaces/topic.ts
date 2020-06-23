import WSTT_Client from "../controllers/peerController";

export interface KTopicItem {
    key: string,
    consumers: Array<WSTT_Client>
}

export interface KTopic {
    topics: Array<KTopicItem>
}
