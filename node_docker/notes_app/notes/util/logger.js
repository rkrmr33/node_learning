/* eslint-disable global-require */
const urlParser = require('url');

const logger = {
    log: require('./logger-util')('http:server'),
    err: require('./logger-util')('http:server:err'),
};

const logRequest = (req) => {
    const addr = req.connection.remoteAddress;
    const path = urlParser.parse(req.url).pathname;

    logger.log(`got [${req.method} ${path}] request from ${addr}`);
};

module.exports = {
    ...logger,
    logRequest,
};
