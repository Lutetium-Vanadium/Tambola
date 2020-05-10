import React from "react";

import { Screens } from "#root/enums";

import Back from "./Back";
import prizes from "./prizes.svg";
import people from "./people.svg";
import board from "./board.svg";
import { useHistory } from "react-router-dom";

interface NavProps {
  screens: Screens[];
  current: number;
  goto: (index: number) => void;
}

const rem = +getComputedStyle(document.documentElement).fontSize;

const OFFSET = 3 * (isNaN(rem) ? 16 : rem);

function Nav({ screens, current, goto }: NavProps) {
  const history = useHistory();

  const width = (window.innerWidth - OFFSET) / screens.length;

  return (
    <div className="nav">
      <div className="screens">
        <Back onClick={history.goBack} />
        {screens.map((screen, index) => (
          <div className="item" key={screen} onClick={() => goto(index)}>
            <img className="icon" src={icons.get(screen)} alt="icon" />
            <p className="name">{screen}</p>
          </div>
        ))}
      </div>
      <span className="location-bar" style={{ width, transform: `translateX(${current * width + OFFSET}px)` }}></span>
    </div>
  );
}

export default Nav;

const icons = new Map<Screens, string>([
  [Screens.Board, board],
  [Screens.People, people],
  [Screens.Prizes, prizes],
]);
