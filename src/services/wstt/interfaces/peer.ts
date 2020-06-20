import WebSocket = require("ws");
import { appLogger } from "../../../config/constants";
import { EventEmitter } from 'events';

class WSTT_Client extends EventEmitter {
    private socket: WebSocket;
    private isAlive = true;

    private beat () {
        this.isAlive = true;
    }

    constructor(socket: WebSocket) {
        super();
        this.socket = socket;
        this.socket.on('message', this.onMessage);
        this.socket.on('close', this.onSocketClose);
    }
    
    // Events
    private onMessage = (message: string) => {
        appLogger.warning('WSTT Client', message);
        
        this.emit('broadcast', this, message);
    }

    private onSocketClose = (code: number, reason: string) => {
        appLogger.verbose('WSTT Client', `Client closed socket connection`);
    }


    // Public API
    public sendMessage(message: string): void {
        this.socket.send(message);
    }

}

export default WSTT_Client;