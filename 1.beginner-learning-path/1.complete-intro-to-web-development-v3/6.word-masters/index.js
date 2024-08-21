(async function playWordMastersAsync() {
  const validation = {
    absent: `absent`,
    exists: `exists`,
    match: `match`,
  };

  const initialState = await (async function () {
    const loading = document.querySelector(`.loading`);

    return {
      cellIndex: 0,
      guess: ``,
      guessCount: 0,
      isKeyboardDisabled: false,
      letters: Array.from(
        { length: 26 },
        function getAsciiLetterValue(_, index) {
          return index + 97;
        }
      ).map(function asciiToLetter(value) {
        return String.fromCharCode(value);
      }),
      loading: {
        hide() {
          loading.classList.remove(`loading-visible`);
          loading.classList.add(`loading-hidden`);
        },
        show() {
          loading.classList.remove(`loading-hidden`);
          loading.classList.add(`loading-visible`);
        },
      },
      numGuesses: 6,
      rowIndex: 0,
      wordOfTheDay: await (async function getWordOfTheDayAsync() {
        const response = await fetch(
          `https://words.dev-apis.com/word-of-the-day`
        );
        const json = await response.json();
        return json.word;
      })(),
    };
  })();

  let state = { ...initialState };

  const container = (function buildWordMastersUI() {
    const rows = Array.from({ length: state.numGuesses }, function createRow() {
      const row = document.createElement(`div`);

      row.classList.add(`row`);

      return row;
    });

    const container = document.querySelector(`.container`);

    rows.forEach(function appendRowToContainer(row) {
      container.appendChild(row);

      const cells = Array.from(
        { length: state.wordOfTheDay.length },
        function createCell() {
          const cell = document.createElement(`span`);
          cell.classList.add(`cell`);
          return cell;
        }
      );

      cells.forEach(function appendCellToRow(cell) {
        row.appendChild(cell);
      });
    });

    return container;
  })();

  document.body.addEventListener(`keydown`, handleKeydownAsync);

  async function handleKeydownAsync(event) {
    if (state.isKeyboardDisabled) {
      return;
    }

    const guessComplete = state.guess.length === state.wordOfTheDay.length;

    const letterIndex = state.letters.indexOf(event.key.toLowerCase());

    if (!isPreviousCellInPreviousRow() && event.key === `Backspace`) {
      handleBackspaceClicked();
    } else if (guessComplete && event.key === `Enter`) {
      state.isKeyboardDisabled = true;
      await handleEnterClickedAsync();
    } else if (!guessComplete && letterIndex !== -1) {
      handleLetterClicked(state.letters[letterIndex].toUpperCase());
    }
  }

  function handleBackspaceClicked() {
    state.guess = state.guess.substring(0, state.guess.length - 1);

    goToPreviousCell();

    setValueInCurrentCell(``);
  }

  async function handleEnterClickedAsync() {
    state.loading.show();

    if (!(await isValidWordAsync())) {
      await showInvalidWordAsync();
    } else {
      state.guessCount++;

      const guessValidation = getGuessValidation();

      const isValidGuess = isGuessValid(guessValidation);

      showWordValidation(guessValidation);

      state.guess = ``;

      if (isValidGuess) {
        alert(`Game over! You win!!!!`);
        document.querySelector(`.title`).classList.add(`success`);
      }
    }

    state.loading.hide();

    if (state.guessCount === state.numGuesses) {
      state.isKeyboardDisabled = true;
      alert(`Game over! You lose! The word was: ${state.wordOfTheDay}`);
      return;
    }

    state.isKeyboardDisabled = false;
  }

  function handleLetterClicked(letter) {
    state.guess = `${state.guess}${letter}`;

    setValueInCurrentCell(letter);

    goToNextCell();
  }

  function setValueInCurrentCell(value) {
    if (
      state.rowIndex === state.numGuesses ||
      state.cellIndex < 0 ||
      state.cellIndex + 1 > state.wordOfTheDay.length
    ) {
      return;
    }

    const row = container.querySelector(
      `.row:nth-child(${state.rowIndex + 1})`
    );

    const cell = row.querySelector(`.cell:nth-child(${state.cellIndex + 1})`);

    cell.textContent = value;
  }

  function goToNextCell() {
    const updatedRowIndex =
      state.cellIndex + 1 === state.wordOfTheDay.length
        ? Math.min(state.rowIndex + 1, state.numGuesses - 1)
        : state.rowIndex;

    state.cellIndex =
      state.cellIndex + 1 === state.wordOfTheDay.length &&
      state.rowIndex + 1 < state.numGuesses
        ? 0
        : Math.min(state.cellIndex + 1, state.wordOfTheDay.length - 1);

    state.rowIndex = updatedRowIndex;
  }

  function goToPreviousCell() {
    const updatedRowIndex =
      state.cellIndex === 0 ? Math.max(state.rowIndex - 1, 0) : state.rowIndex;

    state.cellIndex =
      state.cellIndex === 0 && state.rowIndex >= 1
        ? state.wordOfTheDay.length - 1
        : Math.max(state.cellIndex - 1, 0);

    state.rowIndex = updatedRowIndex;
  }

  function isPreviousCellInPreviousRow() {
    return state.cellIndex === 0 && state.rowIndex === state.guessCount;
  }

  function getGuessValidation() {
    const wordOfTheDayLowercased = state.wordOfTheDay.toLowerCase();

    const wordOfTheDayLetterCount = wordOfTheDayLowercased
      .split(``)
      .reduce((map, letter) => {
        map[letter] = (map[letter] ?? 0) + 1;
        return map;
      }, {});

    const guessValidation = {};

    const guessedLetters = state.guess.toLowerCase().split(``);

    guessedLetters.forEach(function (letter, index) {
      if (
        wordOfTheDayLetterCount[letter] &&
        wordOfTheDayLowercased.includes(letter)
      ) {
        if (wordOfTheDayLowercased[index] === letter) {
          if (wordOfTheDayLetterCount[letter] === 1) {
            delete wordOfTheDayLetterCount[letter];
          } else {
            wordOfTheDayLetterCount[letter] -= 1;
          }

          guessValidation[index] = validation.match;
        }
      } else {
        guessValidation[index] = validation.absent;
      }
    });

    guessedLetters.forEach(function (letter, index) {
      if (!guessValidation[index]) {
        if (
          wordOfTheDayLetterCount[letter] &&
          wordOfTheDayLowercased.includes(letter)
        ) {
          if (wordOfTheDayLetterCount[letter] === 1) {
            delete wordOfTheDayLetterCount[letter];
          } else {
            wordOfTheDayLetterCount[letter] -= 1;
          }

          guessValidation[index] = validation.exists;
        } else {
          guessValidation[index] = validation.absent;
        }
      }
    });

    return guessValidation;
  }

  async function isValidWordAsync() {
    const response = await fetch(`https://words.dev-apis.com/validate-word`, {
      body: JSON.stringify({ word: state.guess }),
      method: `POST`,
    });
    const json = await response.json();
    return json.validWord;
  }

  async function showInvalidWordAsync() {
    const row = container.querySelector(`.row:nth-child(${state.rowIndex})`);

    const cells = row.querySelectorAll(`.cell`);

    let cellCount = cells.length;

    await new Promise(function (resolve) {
      cells.forEach(function (cell) {
        cell.classList.add(`cell-invalid-word`);

        cell.addEventListener(`animationend`, function () {
          cellCount--;

          if (cellCount === 0) {
            cells.forEach(function (cell) {
              cell.classList.remove(`cell-invalid-word`);
            });

            resolve();
          }
        });
      });
    });
  }

  function showWordValidation(guessValidation) {
    const currentRow = container.querySelector(
      `.row:nth-child(${state.rowIndex})`
    );

    const cells = currentRow.querySelectorAll(`.cell`);

    cells.forEach(function (cell, index) {
      cell.classList.add(`cell-guessed`);

      switch (guessValidation[index]) {
        case validation.match:
          cell.classList.add(`cell-valid-position`);
          break;
        case validation.exists:
          cell.classList.add(`cell-valid-guess`);
          break;
        case validation.absent:
          cell.classList.add(`cell-invalid`);
          break;
      }
    });
  }

  function isGuessValid(guessValidation) {
    return Object.values(guessValidation).every(
      (validationResult) => validationResult === validation.match
    );
  }
})();
