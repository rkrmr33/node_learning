/* eslint-disable global-require */
const users = require('../models/users.js');

module.exports = async (req, res, next) => {
    let user;
    const { SessionToken } = req.cookies;

    if (SessionToken) {
        user = await users.getByToken(SessionToken);
    }

    if (!user) {
        user = undefined;
    }

    req.user = user;

    next();
};
