/* eslint-disable prefer-rest-params */
const Promise = require('bluebird');
const crypto = Promise.promisifyAll(require('crypto'));

const users = [];
const usersMap = new Map();
const sessionsMap = new Map();

let currentID = 0;

const nextId = () => {
    const ret = currentID;
    currentID += 1;
    return ret;
};

const exists = (email) => usersMap.has(email);

const getSessionToken = async () => {
    const rand = await crypto.randomBytesAsync(16);
    return rand.toString('base64');
};

const authenticate = async (email, password) => {
    if (typeof email !== 'string' || typeof password !== 'string') {
        throw new TypeError('invalid format of email or password'
            + `: ${email}:${password}`);
    }

    const user = usersMap.get(email);

    if (!user || password !== user.password) {
        return undefined;
    }

    const sessionToken = await getSessionToken();
    const { userId } = user;

    sessionsMap.set(sessionToken, user);

    return {
        sessionToken,
        userId,
    };
};

const getById = (id, auth) => {
    const user = sessionsMap.get(auth);
};

class User {
    constructor({
        email,
        password,
        firstName,
        lastName,
    }) {
        if (
            typeof email !== 'string'
            || typeof password !== 'string'
            || typeof firstName !== 'string'
            || typeof lastName !== 'string'
        ) {
            throw new TypeError('bad request, user not '
                + `formated accordingly: ${JSON.stringify(arguments[0])}`);
        }

        this.userId = nextId();
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this._saved = false;
    }

    save() {
        if (this._saved) {
            throw new Error('user already saved');
        }

        users.push(this);
        usersMap.set(this.email, this);
        this._saved = true;
    }

    toString() {
        const copy = { ...this };
        delete copy.password;
        delete copy._saved;

        return JSON.stringify(copy);
    }
}

module.exports = {
    User,
    exists,
    authenticate,
    getById,
};
