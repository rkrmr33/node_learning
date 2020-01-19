/* eslint-disable global-require */
let users;
if (process.env.USERS === 'redis') {
    users = require('../models/users-redis');
} else {
    users = require('../models/users');
}

module.exports = async (req, res, next) => {
    const auth = req.get('Authorization');
    if (auth) {
        req.session = auth;
        req.user = await users.getBySession(auth);
    }

    next();
};
