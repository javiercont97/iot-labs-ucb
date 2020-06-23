import IWSTTAuth from "./wsttAuth";


interface KMessage {
    targetApp: string,
    topic: string,
    message: string | IWSTTAuth | any
}


export default KMessage;