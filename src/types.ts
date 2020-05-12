declare global {
  type RoomDetails = {
    isAdmin: boolean;
    started: boolean;
    connected: Person[];
    prizes: Prize[];
  };

  type Person = {
    name: string;
    id: string;
  };

  type Prize = {
    name: string;
    worth: number;
    completed: boolean;
    type: PrizeTypes;
  };

  type ValidationResponse = {
    success: boolean;
    message: string | string[];
  };

  type Ticket = number[][];
}

enum PrizeTypes {
  FullHouse = "Full House",
  Ladoo = "Ladoo",
  Corner = "Corner",
  TopLine = "Top Line",
  MiddleLine = "Middle Line",
  BottomLine = "Bottom Line",
  EarlyFive = "Early Five",
}
export { PrizeTypes };
