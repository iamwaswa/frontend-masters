const state = {
  isWaitingForPaint: false,
  "player-x": `Waswa`,
  "player-o": `Other`,
  possibleTurns: [`X`, `O`],
  turn: `X`,
  winner: undefined,
};

state.possibleTurns.forEach(function possibleTurnCallback(possibleTurn) {
  document.querySelector(
    `#player-${possibleTurn.toLowerCase()}`
  ).textContent = `Player ${possibleTurn.toUpperCase()}: ${
    state[`player-${possibleTurn.toLowerCase()}`]
  }`;
});

const cells = document.querySelectorAll(`button`);

cells.forEach(function cellCallback(cell) {
  cell.addEventListener(`click`, cellClickEventHandler);
});

async function cellClickEventHandler(event) {
  if (
    state.isWaitingForPaint ||
    state.winner ||
    event.currentTarget.textContent
  ) {
    return;
  }

  event.currentTarget.textContent = state.turn;

  state.isWaitingForPaint = toggleIsWaitingForPaint();

  await new Promise((resolve) => {
    setTimeout(resolve, 10);
  });

  state.isWaitingForPaint = toggleIsWaitingForPaint();

  const { isGameOver, winner } = getGameStatus();

  if (isGameOver) {
    showGameWinner(getGameWinner(winner));
  } else {
    state.turn = toggleTurn(state.turn);
  }
}

function toggleIsWaitingForPaint() {
  return !state.isWaitingForPaint;
}

function getGameStatus() {
  const cellValues = Array.from(cells).reduce(function cellCallback(
    values,
    cell
  ) {
    values.push(cell.textContent);
    return values;
  },
  []);

  // * Check if any rows are won

  if (
    cellValues[0] &&
    cellValues[0] === cellValues[1] &&
    cellValues[1] === cellValues[2]
  ) {
    return { isGameOver: true, winner: cellValues[0] };
  }

  if (
    cellValues[3] &&
    cellValues[3] === cellValues[4] &&
    cellValues[4] === cellValues[5]
  ) {
    return { isGameOver: true, winner: cellValues[3] };
  }

  if (
    cellValues[6] &&
    cellValues[6] === cellValues[7] &&
    cellValues[7] === cellValues[8]
  ) {
    return { isGameOver: true, winner: cellValues[6] };
  }

  // * Check if any columns are won

  if (
    cellValues[0] &&
    cellValues[0] === cellValues[3] &&
    cellValues[3] === cellValues[6]
  ) {
    return { isGameOver: true, winner: cellValues[0] };
  }

  if (
    cellValues[1] &&
    cellValues[1] === cellValues[4] &&
    cellValues[4] === cellValues[7]
  ) {
    return { isGameOver: true, winner: cellValues[1] };
  }

  if (
    cellValues[2] &&
    cellValues[2] === cellValues[5] &&
    cellValues[5] === cellValues[8]
  ) {
    return { isGameOver: true, winner: cellValues[2] };
  }

  // * Check if any diagonals are won

  if (
    cellValues[0] &&
    cellValues[0] === cellValues[4] &&
    cellValues[4] === cellValues[8]
  ) {
    return { isGameOver: true, winner: cellValues[0] };
  }

  if (
    cellValues[2] &&
    cellValues[2] === cellValues[4] &&
    cellValues[4] === cellValues[6]
  ) {
    return { isGameOver: true, winner: cellValues[2] };
  }

  if (cellValues.every((value) => value)) {
    return { isGameOver: true, winner: undefined };
  }

  return { isGameOver: false, winner: undefined };
}

function getGameWinner(winner) {
  if (winner) {
    return winner === `X` ? state[`player-x`] : state[`player-o`];
  }
  return undefined;
}

function showGameWinner(gameWinner) {
  alert(gameWinner ? `${gameWinner} wins!` : `Stalemate!`);
  window.location.reload();
}

function toggleTurn(currentTurn) {
  return currentTurn === `X` ? `O` : `X`;
}
