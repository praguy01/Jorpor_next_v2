import WebSocket from 'ws';

const ws = new WebSocket('wss://your-next-js-app.vercel.app/api/websocket');

ws.on('open', () => {
  console.log('WebSocket connected');
  ws.send('Hello, WebSocket!');
});

ws.on('message', (message) => {
  console.log(`Received message: ${message}`);
});

ws.on('close', () => {
  console.log('WebSocket disconnected');
});
