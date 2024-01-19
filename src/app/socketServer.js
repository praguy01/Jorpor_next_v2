import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: 'https://platform-jorpor.up.railway.app',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
});




io.on('connection', (socket) => {
  console.log('Socket.IO connected');
});

const PORT = 4001; 

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});


export { io };
