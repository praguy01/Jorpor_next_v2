import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { Server as SocketIOServer, Socket } from "socket.io";

const httpServer = http.createServer();

const io = new httpServer(httpServer, {
  cors: {
    origin: 'wss://platform-jorpor.up.railway.app',
    methods: ['GET', 'POST'],
    credentials: false,
  },
  transports: ['websocket'],
  path: '/socket.io',

});

io.engine.on("connection_error", (err) => {
  console.log(err.req);      // the request object
  console.log(err.code);     // the error code, for example 1
  console.log(err.message);  // the error message, for example "Session ID unknown"
  console.log(err.context);  // some additional error context
});


io.on('connection', (socket) => {
  console.log('Socket.IO connected');
});

const PORT = 4001; 

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});


export { io };

