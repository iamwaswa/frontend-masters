const state = {
  breeds: [],
  choices: Array.from({ length: 3 }),
  correctChoiceIndex: undefined,
  currentBreed: {
    image: undefined,
    value: undefined,
  },
};

const main = document.querySelector(`main`);

(async function init() {
  [state.breeds, state.currentBreed] = await Promise.all([
    getAllDogBreedsAsync(),
    getRandomDogBreedAsync(),
  ]);
  [state.correctChoiceIndex, state.choices] = updateChoices(
    state.currentBreed.value,
    state.breeds,
    state.choices.length
  );
  await renderImageAsync(state.currentBreed);
  const ctas = renderCtas(state.breeds, state.choices);
  addClickHandlersToCtas(
    ctas,
    state.correctChoiceIndex,
    state.currentBreed.value
  );
})();

async function getAllDogBreedsAsync() {
  const getDogBreedsApi = `https://dog.ceo/api/breeds/list/all`;
  const response = await fetch(getDogBreedsApi);
  const json = await response.json();
  return Object.entries(json.message).reduce(function toBreeds(
    breeds,
    [breed, subBreeds]
  ) {
    const breedsToAppend = [];

    for (const subBreed of subBreeds) {
      breedsToAppend.push({
        [`${breed}-${subBreed}`]: `${breed} ${subBreed}`,
      });
    }

    if (!breedsToAppend.length) {
      breedsToAppend.push({ [breed]: breed });
    }

    return breeds.concat(breedsToAppend);
  },
  []);
}

async function getRandomDogBreedAsync() {
  const getRandomDogApi = `https://dog.ceo/api/breeds/image/random`;
  const response = await fetch(getRandomDogApi);
  const json = await response.json();
  const image = json.message;
  return {
    image,
    value: /.+\/breeds\/(.+)\/.+/.exec(image)[1],
  };
}

function updateChoices(currentBreedValue, breeds, numChoices) {
  const choices = Array.from({ length: numChoices });
  const correctChoiceIndex = Math.floor(Math.random() * numChoices);
  for (let i = 0; i < numChoices; i++) {
    choices[i] =
      i === correctChoiceIndex
        ? currentBreedValue
        : getRandomDogBreedExcludingValue(currentBreedValue, breeds);
  }
  return [correctChoiceIndex, choices];
}

function getRandomDogBreedExcludingValue(value, options) {
  let randomDogBreed;
  while (!randomDogBreed) {
    const index = Math.floor(Math.random() * options.length);
    const option = options[index];
    if (!option[value]) {
      randomDogBreed = Object.keys(option)[0];
    }
  }
  return randomDogBreed;
}

async function renderImageAsync(currentBreed) {
  const image = document.createElement(`img`);
  image.setAttribute(`alt`, currentBreed.value);
  image.setAttribute(`src`, currentBreed.image);
  main.appendChild(image);
  return new Promise((resolve) => {
    image.onload = resolve;
  });
}

function renderCtas(breeds, choices) {
  const footer = document.createElement(`footer`);
  main.appendChild(footer);

  const ctas = choices.map(function toButton(choice) {
    const button = document.createElement(`button`);
    footer.appendChild(button);
    button.innerText = breeds.find((breed) => breed[choice])[choice];
    button.value = choice;
    return button;
  });

  return ctas;
}

function addClickHandlersToCtas(ctas, correctChoiceIndex, currentBreed) {
  ctas.forEach(function ctaCallback(cta) {
    cta.addEventListener(`click`, function ctaOnClickCallback(event) {
      disableCtas(ctas);

      const isCtaCorrect = event.currentTarget.value === currentBreed;

      event.currentTarget.classList.add(isCtaCorrect ? `correct` : `incorrect`);

      if (!isCtaCorrect) {
        ctas[correctChoiceIndex].classList.add(`correct`);
      }
    });
  });
}

function disableCtas(ctas) {
  ctas.forEach(function ctaCallback(cta) {
    cta.toggleAttribute(`disabled`, true);
  });
}
