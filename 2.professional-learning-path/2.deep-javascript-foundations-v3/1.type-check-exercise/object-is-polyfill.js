if (!Object.is) {
  Object.is = function objectIsPolyfill(value, expected) {
    // * Test for NaN
    if (isNaNValue(value) || isNaNValue(expected)) {
      return isNaNValue(value) && isNaNValue(expected);
    }

    // * Test for -0
    if (isNegativeZero(value) || isNegativeZero(expected)) {
      return isNegativeZero(value) && isNegativeZero(expected);
    }

    return value === expected;

    function isNaNValue(value) {
      return typeof value === `number` && value !== value;
    }

    function isNegativeZero(value) {
      return 1 / value === -Infinity;
    }
  };
}

console.log(`Object.is(NaN, NaN) = ${Object.is(NaN, NaN)}`); // true

console.log(`Object.is(NaN, 0) = ${Object.is(NaN, 0)}`); // false

console.log(`Object.is(NaN, -0) = ${Object.is(NaN, -0)}`); // false

console.log(
  `Object.is(-Infinity, -Infinity) = ${Object.is(-Infinity, -Infinity)}`
); // true

console.log(
  `Object.is(Infinity, -Infinity) = ${Object.is(Infinity, -Infinity)}`
); // false

console.log(`Object.is(Infinity, Infinity) = ${Object.is(Infinity, Infinity)}`); // false

console.log(`Object.is(-0, -0) = ${Object.is(-0, -0)}`); // true

console.log(`Object.is(0, -0) = ${Object.is(0, -0)}`); // false

console.log(`Object.is(0, 0) = ${Object.is(0, 0)}`); // true

console.log(`Object.is("0", "0") = ${Object.is(`0`, `0`)}`); // true
