type PersonDetails = {
  admin: boolean;
  name: string;
};

class Room {
  sockets = new Map<string, PersonDetails>();
  started = false;
  numbers = new Set<number>();
  prizes: Prize[] = [];

  constructor(public id: string) {}

  get length() {
    return this.sockets.size;
  }

  get connected(): Person[] {
    return Array.from(this.sockets.keys(), (id) => ({
      name: this.sockets.get(id)?.name ?? "",
      id,
    }));
  }

  join(id: string, name: string, admin = false) {
    if (this.sockets.has(id)) return this.sockets.get(id)?.admin ?? false;
    this.sockets.set(id, { admin, name });
    return false;
  }

  leave(id: string) {
    const person = this.sockets.get(id);
    this.sockets.delete(id);
    if (person?.admin && this.length > 0) {
      const { id } = this.connected[Math.floor(Math.random() * this.length)];

      const { name } = this.sockets.get(id) ?? { name: "" };

      this.sockets.set(id, { name, admin: true });
      return id;
    }
  }

  isConnected(id: string) {
    return this.sockets.has(id);
  }

  start() {
    this.started = true;
    return this.connected;
  }

  randomNum() {
    let num = Math.ceil(Math.random() * 90);
    while (this.numbers.has(num)) {
      num = Math.ceil(Math.random() * 90);
    }

    this.numbers.add(num);

    return num;
  }

  updatePrize(prizes: Prize[]) {
    this.prizes = prizes;
  }
}

export default Room;
