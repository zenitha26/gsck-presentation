import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

let state = {
  indexh: 0,
  indexv: 0,
  fIndex: 0
};

io.on("connection", (socket) => {
  socket.emit("stateUpdate", state);

  socket.on("slidechange", (data) => {
    state = data;
    socket.broadcast.emit("stateUpdate", state);
  });

  socket.on("getCurrentState", () => {
    socket.emit("stateUpdate", state);
  });
});

// ❌ DO NOT USE app.get("*") IN EXPRESS 5

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server running on", PORT);
});