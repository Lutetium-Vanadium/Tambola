const initializeNumbers = () => {
  let numbers = [];
  for (let a = 1; a <= 90; a++) {
    numbers.push(a);
  }

  return numbers;
};
const choice = (arr: any[]) => {
  const idx = randint(0, arr.length);
  return arr[idx];
};

const getIndex = (ticket: number[][], value: number) => {
  const columnToObserve = value == 90 ? 8 : Math.floor(value / 10);
  let indices: number[] = [];
  for (let row = 0; row < 3; row++) {
    if (
      ticket[row][columnToObserve] == 0 &&
      ticket[row].filter((n) => {
        return n != 0;
      }).length < 5
    ) {
      indices = [0, 0];
      indices[0] = row;
      indices[1] = columnToObserve;
    }
  }
  return indices;
};

const sortColumns = (ticket: number[][]) => {
  for (let col = 0; col < 9; col++) {
    if (ticket[0][col] != 0 && ticket[1][col] != 0 && ticket[2][col] != 0) {
      for (let r = 0; r < 2; r++) {
        if (ticket[r][col] > ticket[r + 1][col]) {
          const temp = ticket[r][col];
          ticket[r][col] = ticket[r + 1][col];
          ticket[r + 1][col] = temp;
        }
      }
    } else if (ticket[0][col] != 0 && ticket[1][col] != 0 && ticket[2][col] == 0) {
      if (ticket[0][col] > ticket[1][col]) {
        const temp = ticket[0][col];
        ticket[0][col] = ticket[1][col];
        ticket[1][col] = temp;
      }
    } else if (ticket[0][col] != 0 && ticket[1][col] == 0 && ticket[2][col] != 0) {
      if (ticket[0][col] > ticket[2][col]) {
        const temp = ticket[0][col];
        ticket[0][col] = ticket[2][col];
        ticket[2][col] = temp;
      }
    } else if (ticket[0][col] == 0 && ticket[1][col] != 0 && ticket[2][col] != 0) {
      if (ticket[1][col] > ticket[2][col]) {
        const temp = ticket[1][col];
        ticket[1][col] = ticket[2][col];
        ticket[2][col] = temp;
      }
    }
  }
  return ticket;
};
//Based on the ticket, remove based on #Rule-1 and #Rule-3
const removeValuesUsed = (ticket: number[][], numbers: number[]) => {
  let numbersToBeRemoved = [];
  for (let col = 0; col < 9; col++) {
    if (ticket[2][col] != 0 && ticket[1][col] != 0 && ticket[0][col] != 0) {
      for (let i = col * 10 + 1; i <= col * 10 + 10; i++) {
        numbersToBeRemoved.push(i);
      }
    }
    if (ticket[2][col]) {
      numbersToBeRemoved.push(ticket[2][col]);
    }
    if (ticket[1][col]) {
      numbersToBeRemoved.push(ticket[1][col]);
    }
    if (ticket[0][col]) {
      numbersToBeRemoved.push(ticket[0][col]);
    }
  }
  if (numbersToBeRemoved.length) {
    numbersToBeRemoved.map((val) => {
      const index = numbers.indexOf(val);
      if (index != -1) numbers.splice(index, 1);
    });
  }
};

const randint = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

const generateTicket = () => {
  const numbers = initializeNumbers();
  let ticket = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  for (let j = 1; j <= 15; j++) {
    let randomNumber: number = 0;
    if (j <= 9) {
      let min = 0,
        max = 10;
      if (j === 1) {
        min = 1;
      } else if (j === 9) {
        max = 11;
      }

      randomNumber = (j - 1) * 10 + randint(min, max);
    } else {
      randomNumber = choice(numbers);
    }
    const index = getIndex(ticket, randomNumber);

    if (index.length) {
      ticket[index[0]][index[1]] = randomNumber;
      removeValuesUsed(ticket, numbers);
    } else {
      j--;
    }
  }
  ticket = sortColumns(ticket);
  return ticket;
};

export default generateTicket;
