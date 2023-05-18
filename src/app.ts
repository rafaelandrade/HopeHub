import { config } from 'dotenv'
import { createServer, Server } from 'http';
import * as socketIo from 'socket.io';
import express, { Express, Request, Response } from 'express'
import { ChatEvents } from "./utils";
import { ChatMessage } from "./types";
import cors from 'cors';

export class App {
    public static readonly PORT: number = 8080;

    private _app: express.Application;
    private server: Server;
    private io: socketIo.Server;
    private port: string | number;

    constructor() {
        this._app = express();
        this.port = process.env.PORT || App.PORT;
        this._app.use(cors());
        this._app.options('*', cors());
        this.server = createServer(this._app);
        this.initSocket();
        this.listen();
    }

    private initSocket () {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.io = socketIo(this.server);
    }

    private listen () {
        this.server.listen(this.port, () => {
            console.log('Running server on port ', this.port);
        })

        this.io.on(ChatEvents.CONNECT, (socket: any) => {
            console.log('Connected client on port ', this.port);

            socket.on(ChatEvents.MESSAGE, (message: ChatMessage) => {
                console.log('[SERVER](message): ', JSON.stringify(message))
                this.io.emit('message: ', message);
            })

            socket.on(ChatEvents.DISCONNECT, () => {
                console.log('Client disconnected!');
            })
        })
    }

    get app (): express.Application {
        return this._app;
    }
}