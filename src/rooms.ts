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
    const adminId = this._rooms[roomId]?.leave(id);

    if (this._rooms[roomId]?.length === 0) {
      delete this._rooms[roomId];
    }
    return adminId;
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

  getPrizes(id: string) {
    return this._rooms[id]?.prizes;
  }

  updatePrizes(id: string, prizes: Prize[]) {
    this._rooms[id]?.updatePrize(prizes);
  }
}

export default Rooms;
