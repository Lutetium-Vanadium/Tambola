export type RoomDetails = {
  isAdmin: boolean;
  started: boolean;
  connected: Person[];
};

export type Person = {
  name: string;
  id: string;
};
