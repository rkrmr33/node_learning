const logger = require('../util/logger.js');
const users = require('../models/users.js');
const httpUtil = require('../util/http_util.js');

exports.path = '/users/login';

exports.post = async (req, res) => {
    const body = await httpUtil.readBody(req);

    try {
        const auth = JSON.parse(body);
        const ret = await users.authenticate(auth.email, auth.password);

        if (!ret) {
            res.statusCode = 401; // Unauthorized
            res.end();

            return;
        }

        // authenticated
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(ret));
    } catch (err) {
        logger.err(err.message);

        res.statusCode = 400; // Bad request
        res.end();
    }
};
