import IWSTTAuth from "./wsttAuth";


interface KMessage {
    topic: string,
    message: string | IWSTTAuth | any
}


export default KMessage;