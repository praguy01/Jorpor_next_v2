// import http from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';

// const httpServer = http.createServer();
// console.log("88888888888888888888888888888888888888888888888888888")

// const io = require("socket.io")(httpServer, {
//   cors: {
//     origin: 'https://platform-jorpor-chada.koyeb.app',
//     methods: ['GET', 'POST'],
//     // allowedHeaders: ["my-custom-header"],
//     credentials: true,
//   },
//   // transports: ['websocket'],
//   // path: '/socket.io',
// });

// io.on('connection', (socket) => {
//   console.log('Socket.IO connected');
// });

// io.on('error', (error) => {
//   console.error('Socket.IO Error:', error);
// });

// const PORT = 4001; 

// httpServer.listen(PORT, () => {
//   console.log(`Socket.IO server running on http://localhost:${PORT}`);
// });

// export { io };

// import { createServer } from 'http'
// import { Server } from 'socket.io'
// let count = 0

// let httpServer = createServer()
// const io = new Server(httpServer, {
//     cors: {
//         origin: 'http://localhost:3000'
//     }
// })

// io.on('connection', (socket) => {
//     count++;
//     console.log("connected: ", count)
//     socket.on('disconnect', () => {
//         count--
//         console.log("disconnected: ", count)
//         socket.emit("count", count)
//         socket.broadcast.emit("count", count)
//     })
//     socket.emit("count", count)
//     socket.broadcast.emit("count", count)
// })


// httpServer.listen(3001)
// console.log("listening port 3001")

// export { io };
