import React, { useState, useEffect, useRef } from "react";
import { RouteComponentProps } from "react-router-dom";

import socket from "#root/socketio";
import Board from "./Board";
import store from "#root/store";

interface GameProps extends RouteComponentProps<{ id: string }> {}

// const details = {
//   isAdmin: false,
//   connected: [],
//   started: false,
// };

function Game({
  match: {
    params: { id },
  },
}: GameProps) {
  const [started, setStarted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [connectedPeople, setConnectedPeople] = useState<string[]>([]);
  const prevId = useRef<string>("test");

  useEffect(() => {
    console.log(id, prevId);
    socket.emit("join-game", id, store.get("name"));

    socket.on("room-details", (details: RoomDetails) => {
      setIsAdmin(details.isAdmin);
      setConnectedPeople(details.connected);
      setStarted(details.started);
      console.log(details);
    });

    socket.on("new-player", (name: string) => {
      setConnectedPeople((connectedPeople) => [...connectedPeople, name]);
    });

    prevId.current = id;

    return () => {
      console.log("LEAVING", id);
      socket.emit("leave-game", id);
    };
  }, []);

  return <Board id={id} />;
}

export default Game;
