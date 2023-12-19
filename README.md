# NestJS Websocket Server
A example of a SocketIO server with rooms, running on a NestJS server.

## PD Integration
To run the socket server in PD, the module needs to be registered in PD: `apps/api/src/app.module.ts`.

All code relevent to PD can be found in `src/message/` module:
 - `message.gateway.tsx` receives and relays messages, manages clients into rooms, and starts the WSS.
 - `message.service.tsx` defines the MessageService class which handles the clients.
 - `message.module.tsx` is required by NestJS to add the module.

**Note**, the server cannot retrieve the username of a client from the authToken as authentication has not yet been implemented. For now the clients are identified by only their Socket IO id.

## Client Example
The following is a JS example of a client connecting to, and messaging, the server:

```js
// Connect to Socket Server
const socket = io("/", {
  query: {
    room: "room-identifier", /* likely the projectId + roomId */
    authToken: "12345"       /* authToken of client so message sender can be identified */
  }
});

// Send 'msg' Message
socket.emit( "msg", "message text!" );

// Send 'move' Message
socket.emit( "move", { position: [0,0,0], rotation: [0,0,0] } );
```

