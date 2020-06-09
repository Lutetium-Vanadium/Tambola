import React, { useEffect, useState } from "react";

import moneySvg from "./money.svg";
import Dropdown from "#shared/Dropdown";

const BOX_WIDTH = 0.11 * window.innerWidth;

interface BoardProps {
  ticket: Ticket;
  money: number;
  prizes: Prize[];
  lastNum: number | null;
  numbers: Set<number>;
  isAdmin: boolean;
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>;
  claimPrize: (index: number) => void;
}
const iterator90 = new Array(90).fill(0);

function Board({ ticket, money, prizes: _prizes, lastNum, numbers, isAdmin, setTicket, claimPrize: _claimPrize }: BoardProps) {
  const [prizes, setPrizes] = useState<string[]>(_prizes.filter((prize) => !prize.completed).map((prize) => prize.name));
  const [showNumbers, setShowNumbers] = useState(false);

  const claimPrize = (str: string) => {
    _claimPrize(_prizes.findIndex((value) => value.name === str));
  };

  const toggleCancel = (x: number, y: number) => {
    const newBoard = deepCopy(ticket);

    newBoard[y][x] *= -1;
    setTicket(newBoard);
  };

  useEffect(() => {
    setPrizes(_prizes.filter((prize) => !prize.completed).map((prize) => prize.name));
  }, [_prizes]);

  return (
    <div className="tickets">
      <div className="money-wrapper">
        <img src={moneySvg} alt="money" />
        <p className="money">Amount Won:</p>
        <span>{money}</span>
      </div>
      {isAdmin &&
        (showNumbers ? (
          <>
            <div className="full-screen" onClick={() => setShowNumbers(false)}></div>
            <div className="all-numbers-grid">
              {iterator90.map((_, i) => {
                const num = i + 1;
                const baseClass = `box-${Math.floor(i / 10)}-${i % 10}`;
                return <div className={`${baseClass}${numbers.has(num) ? " cancelled" : ""}`}>{num}</div>;
              })}
            </div>
          </>
        ) : (
          <button onClick={() => setShowNumbers(true)} className="show-numbers">
            Numbers
          </button>
        ))}
      {lastNum && <h3>Last Number: {lastNum}</h3>}
      <div className="ticket">
        {ticket.map((arr, y) => (
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
      <div className="claim-prizes">
        <Dropdown placeholder="Prize to Claim" value="Claim Prize" options={prizes} changeValue={claimPrize} isButton />
      </div>
    </div>
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
