const character = `X`;

const timesToRepeat = 100;

let output = ``;

for (let i = 0; i < timesToRepeat; i++) {
  output = `${output}${character}`;
}

console.log(output);
