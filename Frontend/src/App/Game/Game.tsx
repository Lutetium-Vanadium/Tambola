import React, { useState, useEffect } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";

import socket from "#root/socketio";
import store from "#root/store";
import notification from "#shared/notification";

import Board from "./Board";
import WaitingRoom from "./WaitingRoom";
import showNumber from "#shared/showNumber";

interface GameProps extends RouteComponentProps<{ id: string }> {}

const temp = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi omnis fugiat atque eum, dignissimos facere cum? Facilis nesciunt magnam maiores!"
  .split(" ")
  .map((word) => ({ name: word, id: word }));

function Game({
  match: {
    params: { id: roomId },
  },
}: GameProps) {
  const [started, setStarted] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);
  const [connectedPeople, setConnectedPeople] = useState<Person[]>([]);

  const history = useHistory();

  const startGame = () => {
    socket.emit("start-game", roomId);
  };

  const generateNumber = () => {
    socket.emit("generate-number", roomId);
  };

  useEffect(() => {
    console.log({ id: roomId });
    socket.emit("join-game", roomId, store.get("name"));

    const roomDetails = (details: RoomDetails) => {
      setIsAdmin(details.isAdmin);
      setConnectedPeople(details.connected);
      setStarted(details.started);
      console.log(details);
    };

    const newPlayer = (person: Person) => {
      if (person.id === socket.id) return;
      console.log({ person });
      setConnectedPeople((connectedPeople) => [...connectedPeople, person]);
    };

    const forceLeave = (playerId: string) => {
      if (playerId === socket.id) {
        socket.emit("leave-game", roomId);
        notification("You were kicked out of the room by the owner");
        history.push("/");
      }
    };

    const playerLeft = (playerId: string) => {
      setConnectedPeople((connectedPeople) => connectedPeople.filter((person) => person.id !== playerId));
    };

    const startGame = () => {
      setStarted(true);
    };

    const newNumber = (num: number) => {
      showNumber(num);
    };

    socket
      .on("room-details", roomDetails)
      .on("new-player", newPlayer)
      .on("force-leave", forceLeave)
      .on("player-left", playerLeft)
      .on("start-game", startGame)
      .on("new-number", newNumber);

    return () => {
      console.log("UNMOUNTING GAME: LEAVING", roomId);
      socket.emit("leave-game", roomId);
      socket
        .off("room-details", roomDetails)
        .off("new-player", newPlayer)
        .off("force-leave", forceLeave)
        .off("player-left", playerLeft)
        .off("start-game", startGame)
        .off("new-number", newNumber);
    };
  }, [roomId]);

  const shareText = `Join my game of Tambola by clicking on the link below!%0a%0a ${encodeURIComponent(
    `${window.location.origin}?id=${roomId}`
  )}`;

  return (
    <div className="page">
      {started ? (
        <Board people={connectedPeople} isAdmin={isAdmin} roomId={roomId} />
      ) : (
        <WaitingRoom roomId={roomId} people={connectedPeople} isAdmin={isAdmin} />
      )}
      <div className="btns">
        <a href={`whatsapp://send?text=${shareText}`} data-action="share/whatsapp/share" className="share">
          Share
        </a>
        {isAdmin && (started ? <button onClick={generateNumber}>Next Number</button> : <button onClick={startGame}>Start Game</button>)}
      </div>
    </div>
  );
}

export default Game;
