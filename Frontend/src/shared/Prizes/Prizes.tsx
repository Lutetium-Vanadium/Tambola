import React from "react";

import prizesIcon from "./prizes.svg";

interface PrizesProps {
  prizes: Prize[];
}

function Prizes({ prizes }: PrizesProps) {
  return (
    <>
      <p className="sub-heading">Prizes</p>
      <ul className="list">
        {prizes.map(({ name, worth }, index) => (
          <li className="person" key={index}>
            <img src={prizesIcon} />
            <p className="name">{name}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Prizes;
