(function runCalculator() {
  const initialState = {
    leftOperand: ``,
    rightOperand: `0`,
    operator: ``,
  };

  let state = { ...initialState };

  const setCalculatorDisplay = (function () {
    const output = document.querySelector(`.output`);

    return function (contentToDisplay) {
      output.textContent = contentToDisplay;
    };
  })();

  // * Sets initial calculator display to 0
  setCalculatorDisplay(`0`);

  /**
   * Equals
   */
  document
    .querySelector(`.equals`)
    .addEventListener(`click`, handleEqualsClicked);

  function handleEqualsClicked() {
    if (state.leftOperand && state.operator && state.rightOperand) {
      const calculationResult = `${handleCalculation()}`;

      setLeftOperandState(``);

      setRightOperandState(calculationResult);

      setCalculatorDisplay(calculationResult);
    }
  }

  /**
   * Non-operators
   */
  document
    .querySelector(`.backspace`)
    .addEventListener(`click`, handleBackspaceClicked);

  function handleBackspaceClicked() {
    setRightOperandState(
      state.rightOperand.length === 1
        ? `0`
        : state.rightOperand.substring(0, state.rightOperand.length - 1)
    );

    setCalculatorDisplay(state.rightOperand);
  }

  document
    .querySelector(`.clear`)
    .addEventListener(`click`, handleClearClicked);

  function handleClearClicked() {
    resetState();

    setCalculatorDisplay(state.rightOperand);
  }

  /**
   * Digits
   */
  document.querySelectorAll(`.digit`).forEach((digitElement) => {
    digitElement.addEventListener(`click`, handleDigitClicked);
  });

  function handleDigitClicked(event) {
    const digit = event.target.textContent;

    // * If an operator has been selected
    // * and there is no left operand
    // * then reset the input so that the new input can be displayed
    if (!state.leftOperand && state.operator) {
      state.leftOperand = state.rightOperand;
      state.rightOperand = `0`;
    }

    setRightOperandState(
      state.rightOperand === `0` ? digit : `${state.rightOperand}${digit}`
    );

    setCalculatorDisplay(state.rightOperand);
  }

  /**
   * Operators
   */
  document.querySelectorAll(`.operator`).forEach((operatorElement) => {
    operatorElement.addEventListener(`click`, handleOperatorClicked);
  });

  function handleOperatorClicked(event) {
    if (state.leftOperand) {
      const calculationResult = `${handleCalculation()}`;

      setLeftOperandState(``);

      setRightOperandState(calculationResult);

      setCalculatorDisplay(calculationResult);
    }

    setOperatorState(event.target.textContent);
  }

  function handleCalculation() {
    switch (state.operator) {
      case `÷`:
        return state.rightOperand === `0`
          ? 0
          : Number(state.leftOperand) / Number(state.rightOperand);
      case `×`:
        return Number(state.leftOperand) * Number(state.rightOperand);
      case `-`:
        return Number(state.leftOperand) - Number(state.rightOperand);
      case `+`:
        return Number(state.leftOperand) + Number(state.rightOperand);
      default:
        throw new Error(`Unknown operator: ${state.operator}`);
    }
  }

  function resetState() {
    state = { ...initialState };
  }

  function setLeftOperandState(value) {
    state.leftOperand = value;
  }

  function setOperatorState(value) {
    state.operator = value;
  }

  function setRightOperandState(value) {
    state.rightOperand = value;
  }
})();
