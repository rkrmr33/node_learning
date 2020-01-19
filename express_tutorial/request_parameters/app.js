const express = require('express');
const config = require('../config.json');

const { port, host } = config;
const app = express();

app.param('param', (req, res, next) => {
    console.log('called once!');
    const data = req.params.param;
    req.data = data;
    next();
});

app.get('/:param', (req, res, next) => {
    console.log('reached1');
    res.write(req.data);
    next();
});

app.get('/:param', (req, res, next) => {
    console.log('reached2');
    res.write(req.data);
    res.end();
    next();
});

process.on('uncaughtException', (err) => {
    console.error(err);
});

app.listen(port, host, () => {
    console.log(`listening on: ${host}:${port}`);
});
