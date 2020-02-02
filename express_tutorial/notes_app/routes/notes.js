const { Router } = require('express');
const notes = require('../models/notes.js');

const router = Router();

router.route('/')
    .post(async (req, res) => {
        try {
            const noteJson = req.body;

            if (!req.user) {
                res.status(401).send('you must be logged in to create notes');

                return;
            }

            noteJson.authorId = req.user.userId;
            const note = new notes.Note(noteJson);
            await note.save();
            res.status(201).json(note);
        } catch (err) {
            req.logErr(err);
            res.status(400).send(err.message);
        }
    })
    .get(async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).send('you must be logged in');
            }

            const ret = await notes.getByAuthorId(req.user.userId);
            res.json(ret);
        } catch (err) {
            req.logErr(err);
            req.status(400).send(err.message);
        }
    });

router.route('/:noteId')
    .get(async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).send('you must be logged in');

                return;
            }

            const { noteId } = req.params;
            const authorId = req.user.userId;

            const note = await notes.getById(authorId, noteId);
            if (!note) {
                res.status(404).send(`note with id: ${noteId} not found`);

                return;
            }

            res.json(note);
        } catch (err) {
            req.logErr(err);
            res.status(400).send(err.message);
        }
    })
    .put(async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).send('you must be logged in');

                return;
            }

            const { noteId } = req.params;
            const authorId = req.user.userId;

            const note = await notes.getById(authorId, noteId);
            if (!note) {
                res.status(404).send(`note with id: ${noteId} not found`);

                return;
            }

            if (!req.body) {
                res.status(400).send('wrong JSON format');

                return;
            }

            const newNote = await notes.updateNote(authorId, noteId, req.body);

            res.json(newNote);
        } catch (err) {
            req.logErr(err);
            res.status(400).send(err.message);
        }
    })
    .delete(async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).send('you must be logged in');

                return;
            }

            const { noteId } = req.params;
            const authorId = req.user.userId;

            const edits = await notes.deleteById(authorId, noteId);
            if (edits === 0) {
                res.status(400).send('no notes were deleted, are you sure this note still exists?');

                return;
            }

            res.sendStatus(204); // no content
        } catch (err) {
            req.logErr(err);
            res.status(400).send(err.message);
        }
    });

module.exports = router;
