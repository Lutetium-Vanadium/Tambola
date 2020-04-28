import * as path from "path";
import * as http from "http";
import express from "express";
import socketio from "socket.io";
import Rooms from "./rooms";

const PORT = 3000;

const app = express();
const staticFolder = path.resolve("static");
console.log(staticFolder);
app.use(express.static("static"));

const server = http.createServer(app);
const io = socketio(server);

const rooms = new Rooms();

io.on("connection", (sock) => {
  console.log(sock.id, "joining");
  sock.emit("hello", "Hello Friends");

  sock.on("join-game", (roomId: string, name: string) => {
    const isAdmin = rooms.join(roomId, sock.id, name);

    if (!isAdmin) {
      io.to(roomId).emit("new-player", name);
    }
    sock.join(roomId);

    rooms.prt();
    console.log("\n");

    sock.emit("room-details", { isAdmin, started: rooms.hasStarted(roomId), connected: rooms.connected(roomId) });
  });

  sock.on("start-game", (roomId: string) => {
    io.to(roomId).emit("start-game");
  });

  sock.on("leave-game", (roomId: string) => {
    console.log("LEAVE");
    sock.leave(roomId);
    rooms.leave(roomId, sock.id);
  });
});

app.get(["/", "/:id/"], (req, res) => res.sendFile("index.html", { root: staticFolder }));

server.listen(PORT, () => console.info(`Listening on port ${PORT}`));
