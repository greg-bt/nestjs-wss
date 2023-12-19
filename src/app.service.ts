import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `

<script src="/socket.io/socket.io.js"></script>
<script>
// Connect to Socket Server



// Send 'msg' Message

function msg() { socket.emit( "msg", "Ping" ) }

// Send 'move' Message

function move() { socket.emit( "move", { position: [1,0,0], rotation: [0,0,0] } ) }

</script>

<button onclick="msg()">Send msg</button>
<button onclick="move()">Send move</button>


<pre>

const socket = io("/", {
  query: {
      room: "room-identifier",
      authToken: "12345"
      }
  }
);

</pre>


`;
  }
}
