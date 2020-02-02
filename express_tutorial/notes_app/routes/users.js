const { Router } = require('express');
const users = require('../models/users.js');

const router = Router();

router.route('/')
    .get((req, res) => {
        res.send('GET /users');
    })
    .post(async (req, res) => {
        try {
            const userJson = req.body;
            const user = new users.User(userJson);
            await user.save();

            const ret = { ...user };
            delete ret.password;

            res.status(201).json(ret);
        } catch (err) {
            req.logErr(err);
            if (err instanceof TypeError) {
                res.status(400).send('wrong JSON format');
            } else {
                res.status(409).send('user already exists');
            }
        }
    });

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const session = await users.authenticate(email, password);

        if (!session) {
            res.status(401).send('wrong email or password');
        } else {
            res.cookie('SessionToken', session.sessionToken);
            res.json(session);
        }
    } catch (err) {
        req.logErr(err);
    }
});

router.get('/current', async (req, res) => {
    res.json(req.user);
});

module.exports = router;
