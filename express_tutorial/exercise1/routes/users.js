/* eslint-disable global-require */
const { Router } = require('express');

let users;
if (process.env.USERS === 'redis') {
    users = require('../models/users-redis');
} else {
    users = require('../models/users');
}

const router = Router();

router.route('/')
    .get(async (req, res) => {
        const { userId } = req.query;

        if (!userId) {
            res.sendStatus(404);
        } else {
            const user = await users.getById(userId, req.session);

            if (!user) {
                res.sendStatus(401);
            } else {
                res.type('json');
                res.send(user.toString());
            }
        }
    })
    .post(async (req, res) => {
        try {
            const userJson = req.body;
            const user = new users.User(userJson);
            await user.save();

            res.type('json');
            res.status(201).send(user.toString());
        } catch (err) {
            req.logErr(err.message);

            if (err instanceof TypeError) {
                res.status(400).send('bad JSON format');
            } else {
                res.status(409).send('user exists');
            }
        }
    });

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await users.authenticate(email, password);
        if (!result) {
            res.status(401).send('wrong email or password');
        }

        res.json(result);
    } catch (err) {
        req.logErr(err.message);

        if (err instanceof TypeError) {
            res.status(400).send('bad JSON format');
        } else {
            res.status(409).send('user exists');
        }
    }
});

router.get('/current', (req, res) => {
    if (!req.user) {
        res.sendStatus(401);
    } else {
        res.type('json');
        res.send(req.user.toString());
    }
});

module.exports = router;
