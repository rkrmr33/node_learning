const redis = require('redis');
const Promise = require('bluebird');
const logger = require('../util/logger');

Promise.promisifyAll(redis.RedisClient.prototype);

const host = process.env.REDIS_HOST || '127.0.0.1';
const port = process.env.REDIS_PORT || 6379;

const client = redis.createClient({
    host,
    port,
});

const usersMap = 'users';
const sessionsMap = 'sessions';

client.on('error', logger.err);
client.on('ready', () => { logger.log(`connected to redis host on: ${host}:${port}`); });

const saveUser = async (user) => {
    const exists = await client.HEXISTSAsync(usersMap, user.email);

    if (exists) {
        throw new Error('user exists');
    }

    await client.HSETAsync(usersMap, user.email, JSON.stringify(user));
};

const getUserByEmail = async (email) => {
    const userJson = await client.HGETAsync(usersMap, email);
    if (!userJson) {
        return undefined;
    }

    return JSON.parse(userJson);
};

const getUserByToken = async (session) => {
    const userEmail = await client.HGETAsync(sessionsMap, session);
    if (!userEmail) {
        return undefined;
    }

    return JSON.parse(await client.HGETAsync(usersMap, userEmail));
};

const saveSession = async (session, email) => client.HSETAsync(sessionsMap, session, email);

const saveNote = async (note) => client.HSETAsync(note.authorId, note.noteId, JSON.stringify(note));

const getAllNotesOfAuthor = async (authorId) => {
    const notes = await client.HGETALLAsync(authorId);

    if (!notes) {
        return [];
    }

    return Object.keys(notes).map((key) => JSON.parse(notes[key]));
};

const getNoteById = async (authorId, noteId) => JSON.parse(await client.HGETAsync(authorId, noteId));

const updateNote = async (authorId, noteId, { title, content }) => {
    const note = await getNoteById(authorId, noteId);

    if (!note) {
        throw new Error(`note with id ${noteId} not found`);
    }

    note.title = title || note.title;
    note.content = content || note.content;

    await saveNote(note);

    return note;
};

const deleteNoteById = async (authorId, noteId) => client.HDELAsync(authorId, noteId);

module.exports = {
    saveUser,
    getUserByEmail,
    saveSession,
    getUserByToken,
    saveNote,
    getAllNotesOfAuthor,
    getNoteById,
    updateNote,
    deleteNoteById,
};
