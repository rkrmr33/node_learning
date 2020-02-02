const debug = require('debug');

module.exports = (tag) => {
    const _debug = debug(tag);

    return (...args) => {
        _debug(`[${new Date().toISOString()}]`, ...args);
    };
};
