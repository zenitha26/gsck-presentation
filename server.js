import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let presentationState = {
  indexh: 0,
  indexv: 0,
  fIndex: 0
};

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // send current state immediately
  socket.emit("stateUpdate", presentationState);

  // presenter sends slide updates
  socket.on("slidechange", (state) => {
    presentationState = state;

    // broadcast to ALL audience clients
    socket.broadcast.emit("stateUpdate", presentationState);
  });

  // recovery sync (important for reconnect)
  socket.on("getCurrentState", () => {
    socket.emit("stateUpdate", presentationState);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
