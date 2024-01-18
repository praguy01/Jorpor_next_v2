import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: 'https://platform-jorpor.vercel.app',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket'],
});




io.on('connection', (socket) => {
  console.log('Socket.IO connected');
  // ทำสิ่งที่ต้องการเมื่อมีการเชื่อมต่อ
});

const PORT = 4001; 

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});


export { io };
