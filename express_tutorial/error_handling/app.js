const express = require('express');
const config = require('../config.json');
const logger = require('../../node_intro/logger')('errors');

const { port, host } = config;

const errHandler = (err, req, res, next) => {
    logger('caught some error: ', err.message);
};

const app = express();

app.get('/', (req, res, next) => {
    Promise.reject(new Error('some error'))
        .catch(next);
});

app.use(errHandler); // should set after all routers have been set

app.listen(port, host, () => {
    console.log(`listening on: ${host}:${port}`);
});
