// x can be figured out from the number
type BoardNumber = {
  x: number;
  y: number;
  value: number;
};

type RoomDetails = {
  isAdmin: boolean;
  started: boolean;
  connected: Person[];
};

type Person = {
  name: string;
  id: string;
};
