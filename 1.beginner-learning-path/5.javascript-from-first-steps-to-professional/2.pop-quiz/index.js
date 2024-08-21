const state = {
  questionIndex: 0,
  quiz: [
    {
      answer: true,
      explanation: `Brandon Eich created JS at Netscape in 1995. The initial version of the language was written in just 10 days.`,
      question: `JavaScript was invented in 1995`,
    },
    {
      answer: false,
      explanation: `In JavaScript strings are immutable values, meaning they cannot be edited; however, they can be replaced with new, different strings.`,
      question: `Strings in JS are editable values`,
    },
    {
      answer: true,
      explanation: `The plus operator gives the sum of two numbers.`,
      question: `1 + 1 === 2`,
    },
    {
      answer: false,
      explanation: `The plus operator concatenates (joins together) strings, so '1' + '1' === '11'.`,
      question: `'1' + '1' === '2'`,
    },
    {
      answer: false,
      explanation: `Arrays have the type 'object'. In JS, everything is either a primitive data type (e.g. 'string', 'number') or an object. Arrays are a kind of object with some special properties.`,
      question: `typeof ['J', 'S'] === 'array'`,
    },
  ],
  score: 0,
  total: 0,
};

const choicesCtas = document.querySelectorAll(`[data-choice]`);
const explanation = document.querySelector(`#explanation`);
const nextQuestionCta = document.querySelector(`#next-question`);
const question = document.querySelector(`#question`);
const scoreAndTotal = document.querySelector(`#score-and-total`);

choicesCtas.forEach(function choiceCallback(choiceCta) {
  choiceCta.addEventListener(`click`, function choiceCtaOnClickCallback(event) {
    const currentQuestion = state.quiz[state.questionIndex];

    const isCorrect =
      event.currentTarget.dataset.choice === currentQuestion.answer.toString();
    if (isCorrect) {
      choiceCta.classList.add(`correct`);
    } else {
      choiceCta.classList.add(`incorrect`);
    }

    explanation.textContent = currentQuestion.explanation;

    state.score = getNewScore(isCorrect, state.score);
    state.total = incrementTotal(state.total);
    scoreAndTotal.textContent = getScoreAndTotal(state.score, state.total);

    toggleDisableChoicesActions();

    if (!isLastQuestion()) {
      toggleDisableNextQuestionAction();
    }
  });
});

nextQuestionCta.addEventListener(
  `click`,
  function nextQuestionCtaOnClickCallback() {
    incrementCurrentQuestionIndex();
    removeChoicesActionsValidity();
    toggleDisableChoicesActions();
    resetExplanation();
    toggleDisableNextQuestionAction();
    if (isLastQuestion()) {
      nextQuestionCta.textContent = `No more questions!`;
    } else {
      updateQuestion();
    }
  }
);

updateQuestion();

function updateQuestion() {
  question.textContent = state.quiz[state.questionIndex].question;
}

function getNewScore(isScoreIncreased, currentScore) {
  return isScoreIncreased ? currentScore + 1 : currentScore;
}

function incrementTotal(currentTotal) {
  return currentTotal + 1;
}

function getScoreAndTotal(score, total) {
  return `${score} / ${total}`;
}

function toggleDisableChoicesActions() {
  choicesCtas.forEach(function choiceCtaCallback(choiceCta) {
    choiceCta.toggleAttribute(`disabled`);
  });
}

function toggleDisableNextQuestionAction() {
  nextQuestionCta.toggleAttribute(`disabled`);
}

function incrementCurrentQuestionIndex() {
  state.questionIndex++;
}

function removeChoicesActionsValidity() {
  choicesCtas.forEach(function choiceCtaCallback(choiceCta) {
    choiceCta.classList.remove(`correct`);
    choiceCta.classList.remove(`incorrect`);
  });
}

function resetExplanation() {
  explanation.textContent = ``;
}

function isLastQuestion() {
  return state.questionIndex + 1 === state.quiz.length;
}
