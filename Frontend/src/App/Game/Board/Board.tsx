import React, { useEffect, useState } from "react";

import moneySvg from "./money.svg";
import Dropdown from "#shared/Dropdown";

const BOX_WIDTH = 0.11 * window.innerWidth;

interface BoardProps {
  ticket: Ticket;
  money: number;
  prizes: Prize[];
  toClaim: number;
  setToClaim: React.Dispatch<React.SetStateAction<number>>;
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>;
  claimPrize: (index: number) => void;
}

function Board({ ticket, money, prizes: _prizes, setTicket, toClaim, setToClaim, claimPrize: _claimPrize }: BoardProps) {
  const [prizes, setPrizes] = useState<string[]>(_prizes.filter((prize) => !prize.completed).map((prize) => prize.name));

  const claimPrize = (str: string) => {
    _claimPrize(prizes.indexOf(str));
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
        {/* <button
          className="btn"
          disabled={toClaim < 0}
          onClick={claimPrize}
          // style={toClaim < 0 ? { backgroundColor: "#292929", cursor: "auto" } : {}}
        >
          Claim Prize
        </button> */}
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
