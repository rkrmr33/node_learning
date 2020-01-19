/* eslint-disable global-require */
const urlParser = require('url');

const logger = {
    log: require('../../../node_intro/logger')('http:server'),
    err: require('../../../node_intro/logger')('http:server:err'),
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
