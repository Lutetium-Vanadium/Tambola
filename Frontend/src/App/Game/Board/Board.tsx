import React, { useState, useEffect } from "react";

import generateTicket from "#helpers/generateTicket";
import People from "#shared/People";
import Prizes from "#shared/Prizes";

import prizesSvg from "../prizes.svg";

const ticket = generateTicket();

const BOX_WIDTH = 0.11 * window.innerWidth;

interface BoardProps {
  isAdmin: boolean;
  people: Person[];
  roomId: string;
  prizes: Prize[];
}

function Board({ prizes, ...props }: BoardProps) {
  const [board, setBoard] = useState(ticket);
  const [showPeople, setShowPeople] = useState(false);
  const [showPrizes, setShowPrizes] = useState(false);

  const toggleCancel = (x: number, y: number) => {
    const newBoard = deepCopy(board);

    newBoard[y][x] *= -1;
    setBoard(newBoard);
  };

  return (
    <>
      <div className="nav">
        {showPeople ? <CloseX onClick={() => setShowPeople(false)} /> : <PeopleIcon onClick={() => setShowPeople(true)} />}
        {showPrizes ? (
          <CloseX onClick={() => setShowPrizes(false)} />
        ) : (
          <img src={prizesSvg} alt="prizes" className="icon" onClick={() => setShowPrizes(!showPrizes)} />
        )}
      </div>
      {showPeople ? (
        <People {...props} />
      ) : showPrizes ? (
        <Prizes prizes={prizes} />
      ) : (
        <div className="tickets">
          <div className="ticket">
            {board.map((arr, y) => (
              <span key={y} style={{ top: BOX_WIDTH * y }} className="ticket-row">
                {arr.map((val, x) => {
                  const cancelled = val < 0;
                  val = Math.abs(val);
                  return (
                    <span
                      key={x}
                      style={{ left: BOX_WIDTH * x }}
                      className={`ticket-box${cancelled ? " -cancelled" : ""}`}
                      onClick={() => toggleCancel(x, y)}
                    >
                      <strong>{val === 0 ? null : val}</strong>
                    </span>
                  );
                })}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Board;

const deepCopy = (arr: any[][]) => {
  const newArr: any[][] = [];
  arr.forEach((element) => {
    newArr.push([...element]);
  });

  return newArr;
};

interface SVGHeaderProps {
  onClick: () => void;
}

function CloseX({ onClick }: SVGHeaderProps) {
  return (
    <svg viewBox="0 0 10 10" onClick={onClick}>
      <path
        d="M3 3 L7 7 M7 3 L3 7"
        style={{
          stroke: "#e6e6e6",
          strokeWidth: 1,
          strokeMiterlimit: 4,
          strokeDasharray: "none",
        }}
      />
    </svg>
  );
}

function PeopleIcon({ onClick }: SVGHeaderProps) {
  return (
    <svg viewBox="0 0 82.992828 83.055969" className="icon" onClick={onClick}>
      <path
        d="M 29.926318000000002, 26.913342
           a 11.638951,11.638951 0 1,0 23.277902,0
           a 11.638951,11.638951 0 1,0 -23.277902,0"
        style={{
          fill: "#e6e6e6",
          fillOpacity: 1,
          stroke: "none",
          strokeWidth: 1.4575032,
          strokeMiterlimit: 4,
          strokeDasharray: "none",
        }}
      />
      <path
        d="M 41.622633,43.898449 A 30.850482,30.850482 0 0 0 11.929274,66.498059 38.996415,39.027986 0 0 0 41.853102,80.556653 38.996415,39.027986 0 0 0 71.444898,66.921887 30.850482,30.850482 0 0 0 41.622633,43.898449 Z"
        style={{
          fill: "#e6e6e6",
          fillOpacity: 1,
          stroke: "none",
          strokeWidth: 1.4575032,
          strokeMiterlimit: 4,
          strokeDasharray: "none",
        }}
      />
    </svg>
  );
}
