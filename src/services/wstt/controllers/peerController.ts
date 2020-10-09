import WebSocket = require("ws");
import { appLogger } from "../../../config/constants";
import { EventEmitter } from 'events';
import WSTTAuth from "../middlewares/Auth";
import IWSTTAuth from "../interfaces/wsttAuth";
import KMessage from "../interfaces/message";


class WSTT_Client extends EventEmitter {
    private socket: WebSocket;
    private isAuthenticated: boolean = true;   // assume client will connect with valid credentials

    private isAlive = true;

    private beat() {
        this.isAlive = true;
    }

    constructor(socket: WebSocket) {
        super();
        this.socket = socket;
        this.socket.on('message', this.onMessage);
        this.socket.on('close', this.onSocketClose);

        this.on('badApiKey', this.closeConnection);
    }

    private verifyCredentials = async (authObj: IWSTTAuth) => {
        // should return a promise
        let auth = await WSTTAuth.Authenticate(authObj).then(res => res).catch(err => err);

        if (!auth) {
            this.emit('badApiKey', 'API Key rejected');
            this.socket.send(JSON.stringify({
                topic: 'Auth',
                res: 'rejected'
            }));
        } else {
            this.socket.send(JSON.stringify({
                topic: 'Auth',
                res: 'accepted'
            }));
        }
        
        this.isAuthenticated = auth;
    }

    // Events
    private onMessage = (message: string) => {
        let messageData: KMessage = JSON.parse(message);

        if (messageData.topic == "Auth") {
            let authData: IWSTTAuth = messageData.message;
            this.verifyCredentials(authData).then(() => { }).catch(err => { appLogger.error('WSTT Client', JSON.stringify(err)) });
        } else {
            if (this.isAuthenticated) {
                if (messageData.topic == "Subs") {
                    this.emit('subscribe', messageData.message.topic, this);
                } else {
                    this.emit('broadcast', messageData.topic, messageData.message);
                }
            }
        }
    }

    private onSocketClose = (code: number, reason: string) => {
        appLogger.verbose('WSTT Client', `Socket connection closed`);
        this.emit('closeConnection', this);
    }

    // Public API
    public sendMessage(message: KMessage): void {
        if (this.isAuthenticated) {
            appLogger.verbose('WSTT Client', 'Send message');
            this.socket.send(JSON.stringify(message));
        }
    }
    
    public closeConnection(message: string = 'Closing connection'): void {
        appLogger.verbose('WSTT Client', `Closing connection.${message == 'Closing connection' ? '' : ` ${message}`}`);
        this.socket.send(JSON.stringify({
            topic: 'close',
            message: {
                reason: `${message == 'Closing connection' ? 'Normal close' : ` ${message}`}`
            }
        }));
        this.socket.terminate();
    }
}

export default WSTT_Client;