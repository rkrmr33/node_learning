const calc = require('./calc.cjs');
const fibonacci = require('./fibonacci.cjs');

module.exports = {
    ...calc,
    ...fibonacci
};