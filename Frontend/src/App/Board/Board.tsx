import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import generateTicket from "#root/generateTicket";

const ticket = generateTicket();

const BOX_WIDTH = 0.11 * window.innerWidth;

interface BoardProps extends RouteComponentProps<{ id: string }> {}

function Board({
  match: {
    params: { id },
  },
}: BoardProps) {
  const [board, setBoard] = useState(ticket);

  const toggleCancel = (x: number, y: number) => {
    const newBoard = deepCopy(board);

    newBoard[y][x] *= -1;
    setBoard(newBoard);
  };

  return (
    <div className="page">
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
      <a href={`whatsapp://send?text=${window.location.origin}?id=${id}`} data-action="share/whatsapp/share" className="share">
        Share via Whatsapp
      </a>
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
