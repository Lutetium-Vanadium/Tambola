import * as path from "path";
import * as http from "http";
import express from "express";
import socketio from "socket.io";
import Rooms from "./rooms";
import "./types";

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
      io.to(roomId).emit("new-player", { name, id: sock.id });
    }
    sock.join(roomId);

    // rooms.prt();
    // console.log("\n");

    const details: RoomDetails = {
      isAdmin,
      started: rooms.hasStarted(roomId),
      connected: rooms.connected(roomId),
      prizes: rooms.getPrizes(roomId),
    };

    sock.emit("room-details", details);
    console.log({ [sock.id]: sock.rooms });
  });

  sock.on("start-game", (roomId: string) => {
    io.to(roomId).emit("start-game");
  });

  sock.on("leave-game", (roomId: string) => {
    console.log(sock.id, "LEAVES", roomId);
    sock.leave(roomId);
    const adminId = rooms.leave(roomId, sock.id);
    if (adminId) {
      io.to(adminId).emit("become-admin");
    }
    io.to(roomId).emit("player-left", sock.id);
  });

  sock.on("remove-player", (roomId: string, playerId: string) => {
    console.log(roomId, playerId);
    io.to(roomId).emit("force-leave", playerId);
  });

  sock.on("generate-number", (roomId: string) => {
    const num = rooms.randomNum(roomId);
    io.to(roomId).emit("new-number", num);
  });

  sock.on("update-prize", (roomId: string, prizes: Prize[]) => {
    rooms.updatePrizes(roomId, prizes);
    io.to(roomId).emit("change-prizes", prizes);
  });
});

app.get(["/", "/:id/"], (req, res) => res.sendFile("index.html", { root: staticFolder }));

server.listen(PORT, () => console.info(`Listening on port ${PORT}`));
