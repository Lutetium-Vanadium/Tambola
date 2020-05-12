import { PrizeTypes } from "./types";

type Number = {
  value: number; // actual number
  valid: boolean; // true if and only if it has been called out and is checked
  reason: string; // why valid is false [reason will still be there if valid is true]
};

const CORNERS = [
  [0, 0],
  [0, 4],
  [2, 0],
  [2, 4],
];

const validateTicket = (
  _ticket: Ticket,
  numbers: Set<number>,
  prize: PrizeTypes
): ValidationResponse => {
  const ticket = process(_ticket, numbers);
  let message: string[] = [];

  switch (prize) {
    case PrizeTypes.FullHouse:
      for (const row of ticket) {
        for (const num of row) {
          if (!num.valid) {
            message.push(`${num.value} hasn't been ${num.reason}.`);
          }
        }
      }
      break;
    case PrizeTypes.Ladoo:
      return {
        success: ticket[2][1].valid,
        message: `${ticket[2][1].value} hasn't been ${ticket[2][1].reason}.`,
      };
    case PrizeTypes.Corner:
      for (const [i, j] of CORNERS) {
        if (!ticket[i][j].valid) {
          message.push(
            `${ticket[i][j].value} hasn't been ${ticket[i][j].reason}.`
          );
        }
      }
      break;
    case PrizeTypes.TopLine:
      for (const num of ticket[0]) {
        if (!num.valid) {
          message.push(`${num.value} hasn't been ${num.reason}.`);
        }
      }
      break;
    case PrizeTypes.MiddleLine:
      for (const num of ticket[1]) {
        if (!num.valid) {
          message.push(`${num.value} hasn't been ${num.reason}.`);
        }
      }
      break;
    case PrizeTypes.BottomLine:
      for (const num of ticket[2]) {
        if (!num.valid) {
          message.push(`${num.value} hasn't been ${num.reason}.`);
        }
      }
      break;
    case PrizeTypes.EarlyFive:
      let count = 0;
      for (const row of ticket) {
        for (const num of row) {
          if (num.valid) {
            count++;
          }
        }
      }
      return {
        success: count >= 5,
        message: `At least 5 numbers need to be properly crossed out.`,
      };
    default:
      console.error("Unrecognized prize", prize);
      return { success: false, message: "Internal Error" };
  }
  return { success: message.length === 0, message };
};

export default validateTicket;

const process = (_ticket: Ticket, numbers: Set<number>) => {
  let ticket: Number[][] = [];

  for (const _row of _ticket) {
    let row: Number[] = [];
    for (const num of _row) {
      if (num < 0) {
        row.push({
          valid: numbers.has(num),
          value: -num,
          reason: "called out",
        });
      } else if (num > 0) {
        row.push({
          valid: false,
          value: num,
          reason: "marked",
        });
      }
    }
    ticket.push(row);
  }

  return ticket;
};
