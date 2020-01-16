const _ = require('lodash');

const power = (a, b) => a ** b;

const factorial = (n) => n > 0 ? _.range(1, n + 1).reduce((acc, cur) => acc * cur) : -1;

module.exports = {
    power,
    factorial,
};
