const logger = require('.');

console.log(logger);

const xLogger = logger('x');
console.log(xLogger);

xLogger('check', 123);
