const { Server } = require('socket.io');

export default (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First time, starting socket.io');

    const io = new Server(res.socket.server);
    io.on('connection', socket => {
      socket.emit('message', 'Hello from Vercel Serverless Function!');
    });

    res.socket.server.io = io;
  }

  return res.end();
};
