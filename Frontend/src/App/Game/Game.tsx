import React, { useState, useEffect, useRef } from "react";
import { RouteComponentProps } from "react-router-dom";

// import socket from "#root/socketio";
import Board from "./Board";
import store from "#root/store";
import WaitingRoom from "./WaitingRoom";

interface GameProps extends RouteComponentProps<{ id: string }> {}

const temp = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi omnis fugiat atque eum, dignissimos facere cum? Facilis nesciunt magnam maiores!"
  .split(" ")
  .map((word) => ({ name: word, id: word }));

function Game({
  match: {
    params: { id },
  },
}: GameProps) {
  const [started, setStarted] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [connectedPeople, setConnectedPeople] = useState<Person[]>(temp);

  // useEffect(() => {
  //   socket.emit("join-game", id, store.get("name"));

  //   socket.on("room-details", (details: RoomDetails) => {
  //     setIsAdmin(details.isAdmin);
  //     setConnectedPeople(details.connected);
  //     setStarted(details.started);
  //     console.log(details);
  //   });

  //   socket.on("new-player", (name: string) => {
  //     setConnectedPeople((connectedPeople) => [...connectedPeople, name]);
  //   });

  //   return () => {
  //     console.log("LEAVING", id);
  //     socket.emit("leave-game", id);
  //   };
  // }, []);

  const text = `Join my game of Tambola by clicking on the link below!%0a%0a ${encodeURIComponent(`${window.location.origin}?id=${id}`)}`;

  return (
    <div className="page">
      {started ? <Board people={connectedPeople} isAdmin={isAdmin} /> : <WaitingRoom people={connectedPeople} isAdmin={isAdmin} />}
      <div className="btns">
        <a href={`whatsapp://send?text=${text}`} data-action="share/whatsapp/share" className="share">
          Share
        </a>
        {isAdmin && <button>Start Game</button>}
      </div>
    </div>
  );
}

export default Game;
