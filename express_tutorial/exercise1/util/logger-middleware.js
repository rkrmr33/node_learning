const debug = require('debug');

module.exports = (namespace) => {
    const logger = debug(namespace);
    const errLogger = debug(`${namespace}:error`);

    return {
        log(req, res, next) {
            req.log = (...args) => {
                logger(`[${new Date().toISOString()}] - ${req.hostname}: ${req.method} ${req.originalUrl}`,
                    ...args);
            };

            req.logErr = (...args) => {
                errLogger(`[${new Date().toISOString()}] - ${req.hostname}: ${req.method} ${req.originalUrl}, Error:`,
                    ...args);
            };

            logger(`[${new Date().toISOString()}] - ${req.hostname}: ${req.method} ${req.originalUrl} ${req.ip}`);
            next();
        },
        err(err, req, res, next) {
            errLogger(`[${new Date().toISOString()}] - ${req.hostname}: ${req.method} ${req.originalUrl} ${req.ip} ${err}`);
            next(err);
        },
    };
};
