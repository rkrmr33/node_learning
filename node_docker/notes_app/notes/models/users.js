const crypto = require('crypto');
const storage = require('../storage/storage-redis.js');

const nextId = () => {
    const rand = crypto.randomBytes(12);
    return rand.toString('base64');
};

const createSessionId = async () => {
    const rand = crypto.randomBytes(16);
    return rand.toString('base64');
};

const authenticate = async (email, password) => {
    const user = await storage.getUserByEmail(email);

    if (!user || password !== user.password) {
        return undefined;
    }

    const sessionToken = await createSessionId();
    await storage.saveSession(sessionToken, user.email);

    return {
        sessionToken,
    };
};

const getByToken = async (sessionToken) => storage.getUserByToken(sessionToken);

class User {
    // eslint-disable-next-line object-curly-newline
    constructor({ email, password, firstName, lastName }) {
        if (
            typeof email !== 'string'
            || typeof password !== 'string'
            || typeof firstName !== 'string'
            || typeof lastName !== 'string'
        ) {
            throw new TypeError('wrong json format');
        }

        this.userId = nextId();
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    async save() {
        await storage.saveUser(this);
    }
}

module.exports = {
    User,
    authenticate,
    getByToken,
};
