import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { MessageService } from "./message.service";
import { Server, Socket } from 'socket.io';
import { subscribe } from "diagnostics_channel";
import { type } from "os";

type MoveQuery = {
    room: string;
    position: [number, number,number];
    rotation: [number, number,number];
};

@WebSocketGateway({ cors: true })
export class MessageGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

    constructor(private readonly messageService: MessageService) {}

    // Start WSS
    @WebSocketServer() wss: Server;
    afterInit(server: Server) { }


    // On Disconnect
    handleDisconnect(socket: Socket) {
        this.messageService.deleteClient(socket.id);
    }


    // On Connect
    handleConnection(socket: Socket, ...args: any[]) {

        const room = socket.handshake.query.room;
        const authToken = socket.handshake.query.authToken;

        // Disconnect if room not in query
        if ( typeof room !== 'string' || typeof authToken !== 'string' ){
            socket.disconnect();
            return;
        } 

        // TODO: Check if room exists

        // Add client to relivant room
        socket.join(room);
        this.messageService.newClient( socket.id, authToken, room );

        console.log("client Connection: " + socket.id );
    }

    // On client move
    @SubscribeMessage('move')
    async handleMoveMessage(socket: Socket, payload: any): Promise<void> {
        const { position, rotation } = payload;
        this.messageService.updateClient(
            socket.id,
            position,
            rotation
        );

        const client = this.messageService.getClient(socket.id);

        socket.to(client.room).emit( "move" , {name: client.name, position: client.position, rotation: client.rotation});

    }

    // On client msg
    @SubscribeMessage('msg')
    async handleMsgMessage(socket: Socket, payload: any): Promise<any> {

        // Check that the payload is a string message
        if (typeof payload !== 'string'){ return } 

        // This is where chat filtering and data validation can occur

        const client = this.messageService.getClient(socket.id);

        // console.log(`${socket.id} [${client.room}]: ${payload}`);

        // Relay message to all room clients
        socket.to(client.room).emit("msg", { sender: client.name, message: payload })
    }

}


/*  SocketIO Client Example


// Connect to Socket Server

const socket = io("/", {
    query: {
        room: "room-identifier",
        authToken: "12345"
        }
    }
);

// Send 'msg' Message

socket.emit( "msg", "message text!" );

// Send 'move' Message

socket.emit( "move", { position: [0,0,0], rotation: [0,0,0] } );


*/