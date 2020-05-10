import React from "react";

// import socket from "#root/socketio";
import DeletableList from "#shared/DeletableList";

interface PeopleProps {
  people: Person[];
  isAdmin: boolean;
  roomId: string;
}

function People({ people, isAdmin, roomId }: PeopleProps) {
  const remove = (index: number) => {
    console.log("REMOVING", people[index].id);
    // socket.emit("remove-player", roomId, people[index].id);
  };

  return (
    <>
      <p className="sub-heading">People Playing</p>
      <DeletableList list={people} remove={remove} itemClassName="person" enable={isAdmin}>
        {({ name }) => (
          <>
            <PersonIcon />
            <p className="name">{name}</p>
          </>
        )}
      </DeletableList>
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
