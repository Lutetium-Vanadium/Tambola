import React, { useState, useRef } from "react";

import Dropdown from "#shared/Dropdown";
import DeletableList from "#shared/DeletableList";

import { PrizeTypes } from "#root/enums";
import socket from "#root/socketio";

interface PrizesProps {
  prizes: Prize[];
  isAdmin: boolean;
  roomId: string;
  addPrize: (prize: Prize, num: number) => void;
}

const POPUP_HEIGHT = window.innerHeight / 2;
const PRIZES = Object.values<string>(PrizeTypes);

function Prizes({ prizes, isAdmin, roomId, addPrize: _addPrize }: PrizesProps) {
  const [height, setHeight] = useState(0);
  const [type, setType] = useState<PrizeTypes | null>(null);
  const [worth, setWorth] = useState(50);

  const numberUsed = useRef(
    new Map<PrizeTypes, number>([
      [PrizeTypes.BottomLine, 0],
      [PrizeTypes.Corner, 0],
      [PrizeTypes.EarlyFive, 0],
      [PrizeTypes.FullHouse, 0],
      [PrizeTypes.Ladoo, 0],
      [PrizeTypes.MiddleLine, 0],
      [PrizeTypes.TopLine, 0],
    ])
  );

  const addPrize = () => {
    if (type === null) return;

    const numberTypeUsed = numberUsed.current.get(type) ?? 0;
    numberUsed.current.set(type, numberTypeUsed + 1);

    _addPrize(
      {
        completed: false,
        worth,
        name: type,
        type,
      },
      numberTypeUsed
    );
    setHeight(0);
  };

  const changePrize = (prize: string) => {
    switch (prize) {
      case "Full House":
        setType(PrizeTypes.FullHouse);
        break;
      case "Ladoo":
        setType(PrizeTypes.Ladoo);
        break;
      case "Corner":
        setType(PrizeTypes.Corner);
        break;
      case "Top Line":
        setType(PrizeTypes.TopLine);
        break;
      case "Middle Line":
        setType(PrizeTypes.MiddleLine);
        break;
      case "Bottom Line":
        setType(PrizeTypes.BottomLine);
        break;
      case "Early Five":
        setType(PrizeTypes.EarlyFive);
        break;
      default:
        console.error("Unrecognised prize", prize);
        setType(null);
    }
  };

  const remove = (index: number) => {
    if (confirm(`Are you sure you want to remove ${prizes[index].name}?`)) {
      const prize = prizes[index];
      console.log("Removing", prize);
      if (prize.name !== prize.type) {
        const index = +prize.name[prize.name.length - 1];
        let c = 1;
        let newPrizes: Prize[] = [];
        for (let i = 0; i < prizes.length; i++) {
          if (i === index) continue;
          newPrizes.push(prizes[i]);
          if (prizes[i].type !== prize.type) continue;
          newPrizes[i < index ? i : i - 1].name = `${prizes[i].type} ${c}`;
          c++;
        }
        numberUsed.current.set(prize.type, c - 1);
        console.log(newPrizes);
        socket.emit("update-prize", roomId, newPrizes);
      } else {
        prizes.splice(index, 1);
        console.log(prizes);
        socket.emit("update-prize", roomId, prizes);
      }
    }
  };

  return (
    <>
      <p className="sub-heading" style={prizes.length ? {} : { textAlign: "center", fontSize: "1rem" }}>
        {prizes.length
          ? "Prizes"
          : [
              "There are currently no prizes.",
              <br key="br1" />,
              <br key="br2" />,
              "If you are the creator, click the button below to add prizes, otherwise ask the creator to add prizes",
            ]}
      </p>
      <DeletableList
        list={prizes}
        enable={isAdmin}
        remove={remove}
        itemClassName="prizes"
        End={
          isAdmin
            ? () => (
                <button className="add-prize" onClick={() => setHeight(POPUP_HEIGHT)}>
                  +
                </button>
              )
            : undefined
        }
      >
        {({ name, completed, worth }) => (
          <>
            <PrizeIcon completed={completed} />
            <p className="name">{name}</p>
            <p className="worth">{worth}</p>
          </>
        )}
      </DeletableList>
      {isAdmin && (
        <div className="add-prize-overlay-wrapper" style={{ opacity: height / POPUP_HEIGHT, pointerEvents: height ? "auto" : "none" }}>
          <div style={{ height: window.innerHeight - height }} onClick={() => setHeight(0)}></div>
          <div className="add-prize-overlay" style={{ height }}>
            <h2>Add Prize</h2>
            <Dropdown placeholder="Prize" options={PRIZES} changeValue={changePrize} />
            <p className="worth">
              Worth: <span>{worth}</span>
            </p>
            <input type="range" min={10} max={300} step={10} value={worth} onChange={(e) => setWorth(e.target.valueAsNumber)} />
            <button disabled={type === null} style={type === null ? { backgroundColor: "#292929", cursor: "auto" } : {}} onClick={addPrize}>
              Add
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Prizes;

interface PrizeIconProps {
  completed: boolean;
}

function PrizeIcon({ completed }: PrizeIconProps) {
  return (
    <svg viewBox="-5 -5 106 106">
      <path
        style={{
          stroke: "none",
          fillRule: "nonzero",
          fill: completed ? "green" : "rgb(100%,100%,100%)",
          fillOpacity: 1,
        }}
        d="M 36 8 C 29.421875 8 24 13.421875 24 20 C 24 21.40625 24.296875 22.742188 24.75 24 L 8 24 L 8 40 L 12 40 L 12 76 C 12 80.398438 15.601562 84 20 84 L 44 84 L 44 40 L 52 40 L 52 84 L 76 84 C 80.398438 84 84 80.398438 84 76 L 84 40 L 88 40 L 88 24 L 71.25 24 C 71.703125 22.742188 72 21.40625 72 20 C 72 13.421875 66.578125 8 60 8 C 56.925781 8 54.132812 9.214844 52 11.148438 L 52 11.0625 L 48 15.0625 L 44 11.0625 L 44 11.148438 C 41.867188 9.214844 39.074219 8 36 8 Z M 36 16 C 38.257812 16 40 17.742188 40 20 C 40 22.257812 38.257812 24 36 24 C 33.742188 24 32 22.257812 32 20 C 32 17.742188 33.742188 16 36 16 Z M 60 16 C 62.257812 16 64 17.742188 64 20 C 64 22.257812 62.257812 24 60 24 C 57.742188 24 56 22.257812 56 20 C 56 17.742188 57.742188 16 60 16 Z M 60 16 "
      />
    </svg>
  );
}
