const crypto = require('crypto');
const storage = require('../storage/storage-redis.js');

const nextId = () => {
    const rand = crypto.randomBytes(12);
    return rand.toString('base64');
};

const getById = async (authorId, noteId) => storage.getNoteById(authorId, noteId);

const getByAuthorId = async (authorId) => storage.getAllNotesOfAuthor(authorId);

const updateNote = async (authorId, noteId, { title, content }) => storage.updateNote(authorId, noteId, { title, content });

const deleteById = async (authorId, noteId) => storage.deleteNoteById(authorId, noteId);

class Note {
    // eslint-disable-next-line object-curly-newline
    constructor({ title, content, authorId }) {
        if (
            typeof title !== 'string'
            || typeof content !== 'string'
            || typeof authorId !== 'string'
        ) {
            throw new TypeError('wrong json format');
        }

        this.noteId = nextId();
        this.authorId = authorId;
        this.title = title;
        this.content = content;
    }

    async save() {
        await storage.saveNote(this);
    }
}

module.exports = {
    Note,
    getById,
    getByAuthorId,
    updateNote,
    deleteById,
};
