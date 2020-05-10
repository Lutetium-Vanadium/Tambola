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

enum PrizeTypes {
  FullHouse = "Full House",
  Ladoo = "Ladoo",
  Corner = "Corner",
  TopLine = "Top Line",
  MiddleLine = "Middle Line",
  BottomLine = "Bottom Line",
  EarlyFive = "Early Five",
}
