const urlParser = require('url');
const querystring = require('querystring');
const logger = require('../util/logger.js');
const users = require('../models/users.js');
const httpUtil = require('../util/http_util.js');

exports.path = '/users';

exports.get = async (req, res) => {
    const queryStr = urlParser.parse(req.url).query;
    const query = querystring.parse(queryStr);
    const auth = req.headers.authorization;

    if (!auth) {
        res.statusCode = 401;
        res.end();

        return;
    }

    if (!query || !(typeof query.userId === 'number')) {
        res.statusCode = 400;
        res.end();

        return;
    }

    const user = users.getById(query.userId, auth);

    res.end(user.toString);
};

exports.post = async (req, res) => {
    const body = await httpUtil.readBody(req);

    try {
        const jsonUser = JSON.parse(body);
        const newUser = new users.User(jsonUser);

        if (users.exists(newUser.email)) {
            res.statusCode = 409; // Conflict
            res.end('email exists');

            return;
        }

        newUser.save();

        res.writeHead(201, { 'Content-Type': 'application/json' }); // Created
        res.end(newUser.toString());
    } catch (err) {
        logger.err(err.message);

        res.statusCode = 400; // Bad request
        res.end();
    }
};
