import React, { useState, useEffect } from "react";

const BOX_WIDTH = 0.11 * window.innerWidth;

interface BoardProps {
  ticket: Ticket | null;
  setTicket: React.Dispatch<React.SetStateAction<Ticket | null>>;
}

function Board({ ticket, setTicket }: BoardProps) {
  const [board, setBoard] = useState(ticket ?? []);

  const toggleCancel = (x: number, y: number) => {
    const newBoard = deepCopy(board);

    newBoard[y][x] *= -1;
    setBoard(newBoard);
    setTicket(newBoard);
  };

  useEffect(() => {
    setBoard(ticket ?? []);
  }, [ticket]);

  return (
    <>
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
