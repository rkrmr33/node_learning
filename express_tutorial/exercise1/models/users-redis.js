/* eslint-disable prefer-rest-params */
const Promise = require('bluebird');
const crypto = Promise.promisifyAll(require('crypto'));
const redis = require('redis');
const config = require('../../config.json');
const logger = require('../util/logger');


Promise.promisifyAll(redis.RedisClient.prototype);

const redisPort = config.redisPort || 6379;
const redisHost = config.redisHost || 'localhost';

const client = redis.createClient({
    host: redisHost,
    port: redisPort,
});

client.on('error', logger.err);
client.on('ready', () => { logger.log(`connected to redis host: ${redisHost}:${redisPort}`); });

const usersMap = new Map();

let currentID = 0;

const nextId = () => {
    const ret = currentID;
    currentID += 1;
    return ret;
};

const exists = async (email) => client.HEXISTSAsync('users', email);

const getSessionToken = async () => {
    const rand = await crypto.randomBytesAsync(16);
    return rand.toString('base64');
};

const authenticate = async (email, password) => {
    if (typeof email !== 'string' || typeof password !== 'string') {
        throw new TypeError('invalid format of email or password'
            + `: ${email}:${password}`);
    }

    const userJson = await client.HGETAsync('users', email);
    const user = JSON.parse(userJson);

    if (!user || password !== user.password) {
        return undefined;
    }

    const sessionToken = await getSessionToken();
    const { userId } = user;

    await client.HSETAsync('sessions', sessionToken, JSON.stringify(user));

    return {
        sessionToken,
        userId,
    };
};

const getById = async (id, auth) => {
    const userJson = await client.HGETAsync('sessions', auth);
    const user = JSON.parse(userJson);
    // eslint-disable-next-line no-use-before-define
    user.toString = User.prototype.toString;

    if (!user || user.userId !== Number(id)) {
        return undefined;
    }

    return user;
};

const getBySession = async (session) => {
    const userJson = await client.HGETAsync('sessions', session);
    const user = JSON.parse(userJson);
    // eslint-disable-next-line no-use-before-define
    user.toString = User.prototype.toString;

    return user;
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

    async save() {
        if (this._saved) {
            throw new Error('user already saved');
        } else if (await client.HEXISTSAsync('users', this.email)) {
            throw new Error('user exists');
        }

        await client.HSETAsync('users', this.email, JSON.stringify(this));
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
    getBySession,
};
