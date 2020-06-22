import IWSTTAuth from "./wsttAuth";


interface KMessage {
    topic: string,
    message: string | IWSTTAuth | any,
    sender: string
}


export default KMessage;