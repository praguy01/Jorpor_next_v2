// pages/api/websocket.js

import { Server } from "ws";

export default async function handler(req, res) {
  if (!res.socket.server.ws) {
    console.log("Setting up WebSocket for the first time");

    const wss = new Server({ noServer: true, clientTracking: true });

    // Handle connection event
    wss.on("connection", (ws) => {
      console.log("Client connected");

      // Handle incoming messages from the client
      ws.on("message", (message) => {
        console.log(`Received message: ${message}`);

        // Send a response back to the client
        ws.send(`Server received: ${message}`);
      });

      // Handle the event when the client disconnects
      ws.on("close", () => {
        console.log("Client disconnected");
      });
    });

    res.socket.server.ws = wss;

    // Bind the WebSocket server to the HTTP server
    res.socket.server.on("upgrade", (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    });
  }

  res.end();
}
