import { Screens, PrizeTypes } from "./enums";

export const WAITING_ROOM_SCREENS = [Screens.People, Screens.Prizes];

export const PLAYING_ROOM_SCREENS = [Screens.People, Screens.Board, Screens.Prizes];

export const DEFAULT_PRIZES: Prize[] = [
  { name: "Ladoo", type: PrizeTypes.Ladoo, completed: false, worth: 50 },
  { name: "Early Five", type: PrizeTypes.EarlyFive, completed: false, worth: 50 },
  { name: "Corner", type: PrizeTypes.Corner, completed: false, worth: 50 },
  { name: "Top Line", type: PrizeTypes.TopLine, completed: false, worth: 100 },
  { name: "Middle Line", type: PrizeTypes.MiddleLine, completed: false, worth: 100 },
  { name: "Bottom Line", type: PrizeTypes.BottomLine, completed: false, worth: 100 },
  { name: "Full House 1", type: PrizeTypes.FullHouse, completed: false, worth: 300 },
  { name: "Full House 2", type: PrizeTypes.FullHouse, completed: false, worth: 200 },
];
