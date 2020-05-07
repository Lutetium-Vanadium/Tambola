import React from "react";

import People from "#shared/People";

interface WaitingRoomProps {
  people: Person[];
  isAdmin: boolean;
  roomId: string;
}

function WaitingRoom(props: WaitingRoomProps) {
  return (
    <>
      <h2>Game will start soon</h2>
      <People {...props} />
    </>
  );
}

export default WaitingRoom;
