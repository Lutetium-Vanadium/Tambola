import React, { useState, useRef } from "react";

// import socket from "#root/socketio";

interface PeopleProps {
  people: Person[];
  isAdmin: boolean;
  roomId: string;
}

type TouchDetails = {
  x: number;
  index: number;
};

const THRESHOLD = window.innerWidth / 3;
const SCALE = 2;

function People({ people, isAdmin, roomId }: PeopleProps) {
  const [touchStart, setTouchStart] = useState<TouchDetails>({
    x: 0,
    index: 0,
  });
  const [transform, setTransform] = useState(0);
  const touchMoveDX = useRef(0); // set as useRef to prevent rerender

  const handleTouchStart = (e: React.TouchEvent<HTMLLIElement>) => {
    if (!isAdmin) return;
    setTouchStart({
      x: e.touches[0].clientX,
      index: +(e.currentTarget.dataset["index"] ?? 0),
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLLIElement>) => {
    if (!isAdmin) return;
    touchMoveDX.current = e.touches[0].clientX - touchStart.x;
    if (touchMoveDX.current > THRESHOLD || touchMoveDX.current < -THRESHOLD) {
      setTransform(touchMoveDX.current);
    } else {
      setTransform(0);
    }
  };

  const remove = (index: number) => {
    console.log("REMOVING", people[index].id);
    // socket.emit("remove-player", roomId, people[index].id);
  };

  const handleTouchEnd = () => {
    if (!isAdmin) return;
    if (touchMoveDX.current > THRESHOLD) {
      setTransform(0.25 * SCALE * window.innerWidth);
    } else if (touchMoveDX.current < -THRESHOLD) {
      setTransform(-0.25 * SCALE * window.innerWidth);
    } else {
      setTransform(0);
    }
  };

  return (
    <>
      <p className="sub-heading">People Playing</p>
      <ul className="list">
        {people.map(({ name, id }, index) => (
          <li
            className="person"
            key={id}
            data-index={index}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <p className="left" onClick={() => remove(index)}>
              Remove
            </p>
            <p className="right" onClick={() => remove(index)}>
              Remove
            </p>
            <div
              className="translate-wrapper"
              style={touchStart.index === index ? { transform: `translateX(${transform / SCALE}px)` } : {}}
            >
              <PersonIcon />
              <p className="name">{name}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default People;

function PersonIcon() {
  return (
    <svg viewBox="0 0 82.992828 83.055969">
      <circle
        r="11.638951"
        cy="26.913342"
        cx="41.565269"
        style={{
          fill: "#e6e6e6",
          fillOpacity: 1,
          stroke: "none",
          strokeWidth: 0.5498718,
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
      <ellipse
        ry="39.027985"
        rx="38.996414"
        cy="41.527985"
        cx="41.496414"
        style={{
          fill: "none",
          stroke: "#e6e6e6",
          strokeWidth: 5,
          strokeMiterlimit: 4,
          strokeDasharray: "none",
        }}
      />
    </svg>
  );
}
