import Room from "./room";

type RoomData = {
  [id: string]: Room;
};

class Rooms {
  private _rooms: RoomData;

  constructor(rooms?: RoomData) {
    this._rooms = rooms ?? {};
  }

  get(id: string) {
    return this._rooms[id];
  }

  prt() {
    console.log(this._rooms);
  }

  join(roomID: string, personID: string, name: string) {
    if (this._rooms[roomID] === undefined) {
      const room = new Room(roomID);
      room.join(personID, name, true);
      this._rooms[roomID] = room;
      return true;
    }
    return this._rooms[roomID].join(personID, name);
  }

  leave(roomId: string, id: string) {
    this._rooms[roomId]?.leave(id);
  }

  start(id: string) {
    return this._rooms[id]?.start();
  }

  hasStarted(id: string) {
    return this._rooms[id]?.started;
  }

  connected(id: string) {
    return this._rooms[id]?.connected;
  }

  randomNum(id: string) {
    return this._rooms[id]?.randomNum();
  }
}

export default Rooms;
