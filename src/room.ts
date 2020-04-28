type Person = {
  admin: boolean;
  name: string;
};

class Room {
  sockets = new Map<string, Person>();
  started = false;

  get length() {
    return this.sockets.size;
  }

  get connected() {
    return Array.from(this.sockets.keys(), (id) => this.sockets.get(id)?.name);
  }

  constructor(public id: string) {}

  join(id: string, name: string, admin = false) {
    this.sockets.set(id, { admin, name });
  }

  leave(id: string) {
    this.sockets.delete(id);
  }

  isConnected(id: string) {
    return this.sockets.has(id);
  }

  start() {
    this.started = true;
    return this.connected;
  }
}

export default Room;
