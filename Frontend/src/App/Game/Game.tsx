import React, { useRef, useState, useEffect } from "react";
import { RouteComponentProps, useHistory } from "react-router-dom";

import socket from "#root/socketio";
import { Screens } from "#root/enums";
import { PLAYING_ROOM_SCREENS, WAITING_ROOM_SCREENS, DEFAULT_PRIZES } from "#root/constants";
import store from "#root/store";
import notification from "#shared/notification";
import showNumber from "#shared/showNumber";
import generateTicket from "#helpers/generateTicket";

import Board from "./Board";
import Nav from "./Nav";
import People from "./People";
import Prizes from "./Prizes";

interface GameProps extends RouteComponentProps<{ id: string }> {}

// const tempPeople = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi omnis fugiat atque eum, dignissimos facere cum? Facilis nesciunt magnam maiores!"
//   .split(" ")
//   .map((word) => ({ name: word, id: word }));

let firstMount = true;

function Game({
  match: {
    params: { id: roomId },
  },
}: GameProps) {
  const [started, setStarted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [connectedPeople, setConnectedPeople] = useState<Person[]>([]);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);
  const [money, setMoney] = useState(0);
  const [ticket, setTicket] = useState<Ticket | null>(generateTicket());
  const [numbers, setNumbers] = useState(new Set<number>());
  const [lastNum, setLastNum] = useState<number | null>(null);
  const [disableNextNum, setDisableNextNum] = useState(false);

  const buffer = useRef<Prize[] | null>(null);

  const history = useHistory();

  const startGame = () => {
    socket.emit("start-game", roomId);
  };

  const generateNumber = () => {
    if (numbers.size === 91) {
      notification("All numbers have been called out!");
    }
    setDisableNextNum(true);
    socket.emit("generate-number", roomId);
  };

  const addPrize = (prize: Prize, num: number) => {
    setPrizes((prizes) => {
      if (num > 0) {
        prize.name += ` ${num + 1}`;
      }
      if (num === 1) {
        let c = 1;
        for (let i = 0; i < prizes.length; i++) {
          if (prizes[i].type !== prize.type) continue;
          prizes[i].name += ` ${c}`;
          c++;
        }
      }
      socket.emit("update-prize", roomId, [...prizes, prize]);
      return [...prizes, prize];
    });
  };

  const defaultPrizes = () => {
    setPrizes(DEFAULT_PRIZES);
    socket.emit("update-prize", roomId, DEFAULT_PRIZES);
  };

  const claimPrize = (index: number) => {
    if (prizes[index].completed) return;
    socket.emit("claim-prize", ticket, index, roomId);
  };

  useEffect(() => {
    if (firstMount) {
      firstMount = false;
      return;
    }

    socket.emit("join-game", roomId, store.get("name"));
    const roomDetails = (details: RoomDetails) => {
      setIsAdmin(details.isAdmin);
      setConnectedPeople(details.connected);
      setStarted(details.started);
      setPrizes(details.prizes);
      console.log(details);
    };
    const newPlayer = (person: Person) => {
      if (person.id === socket.id) return;
      console.log({ person });
      setConnectedPeople((connectedPeople) => [...connectedPeople, person]);
    };
    const changePrizes = (prizes: Prize[]) => {
      setPrizes(prizes);
    };
    const bufferPrizes = (prizes: Prize[]) => {
      buffer.current = prizes;
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
    const claimPrize = (id: string, name: string, prize: Prize, result: ValidationResponse) => {
      if (result.success) {
        notification(`${id === socket.id ? "You have" : `${name} has`} claimed ${prize.name}! 🥳`);
        if (id === socket.id) {
          setMoney((money) => money + prize.worth);
        }
      } else if (id === socket.id) {
        notification(
          [
            `You wrongly claimed ${prize.name}. ❌`,
            "Reason: ",
            ...(typeof result.message === "string" ? [result.message] : result.message),
          ],
          true
        );
      } else {
        notification(`${name} wrongly claimed ${prize.name}. ❌`);
      }
    };
    const startGame = () => {
      setCurrentScreenIndex(1);
      setStarted(true);
      setTicket(generateTicket());
    };
    const newNumber = (num: number) => {
      if (num === -1) {
        notification("All numbers have been called!");
      } else {
        setLastNum(num);
        setDisableNextNum(false);
        setNumbers((numbers) => {
          numbers.add(num);
          return numbers;
        });
        showNumber(num);
      }
      if (buffer.current) {
        setPrizes(buffer.current);
      }
    };
    const becomeAdmin = () => {
      setIsAdmin(true);
      notification("You are now admin of the game.");
    };

    socket
      .on("room-details", roomDetails)
      .on("new-player", newPlayer)
      .on("change-prizes", changePrizes)
      .on("buffer-prizes", bufferPrizes)
      .on("force-leave", forceLeave)
      .on("player-left", playerLeft)
      .on("claim-prize", claimPrize)
      .on("start-game", startGame)
      .on("new-number", newNumber)
      .on("become-admin", becomeAdmin);

    return () => {
      console.log("UNMOUNTING GAME: LEAVING", roomId);
      socket.emit("leave-game", roomId);
      socket
        .off("room-details", roomDetails)
        .off("new-player", newPlayer)
        .off("change-prizes", changePrizes)
        .off("buffer-prizes", bufferPrizes)
        .off("force-leave", forceLeave)
        .off("player-left", playerLeft)
        .off("claim-prize", claimPrize)
        .off("start-game", startGame)
        .off("new-number", newNumber)
        .off("become-admin", becomeAdmin);
    };
  }, [roomId]);

  const shareText = `Join my game of Tambola by clicking on the link below!%0a%0a ${encodeURIComponent(
    `${window.location.origin}?id=${roomId}`
  )}`;

  const screens = started ? PLAYING_ROOM_SCREENS : WAITING_ROOM_SCREENS;

  return (
    <div className="page">
      <Nav screens={screens} current={currentScreenIndex} goto={setCurrentScreenIndex} />
      <div className="screen">
        {!started && <h2>Game will start soon</h2>}
        {screens[currentScreenIndex] === Screens.Board ? (
          <Board
            lastNum={lastNum}
            ticket={ticket ?? []}
            prizes={prizes}
            setTicket={setTicket}
            claimPrize={claimPrize}
            isAdmin={isAdmin}
            numbers={numbers}
            money={money}
          />
        ) : screens[currentScreenIndex] === Screens.People ? (
          <People people={connectedPeople} isAdmin={isAdmin} roomId={roomId} />
        ) : screens[currentScreenIndex] === Screens.Prizes ? (
          <Prizes prizes={prizes} unlocked={isAdmin && !started} roomId={roomId} addPrize={addPrize} defaultPrizes={defaultPrizes} />
        ) : (
          `ERROR, Unknown Screen: ${screens[currentScreenIndex]}`
        )}
      </div>
      <div className="btns">
        <a href={`whatsapp://send?text=${shareText}`} data-action="share/whatsapp/share" className="share">
          Share
        </a>
        {isAdmin &&
          (started ? (
            <button disabled={disableNextNum} onClick={generateNumber}>
              Next Number
            </button>
          ) : (
            <button disabled={prizes.length === 0} onClick={startGame}>
              Start Game
            </button>
          ))}
      </div>
    </div>
  );
}

export default Game;
