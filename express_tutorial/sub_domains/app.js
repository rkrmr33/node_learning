const express = require('express');
const { port, host, title } = require('../config.json');

const app = express();
const sub = express();
const subsub = express();

app.locals.title = title;

app.use('/sub', sub);
sub.use('/sub', subsub);

subsub.get('/', (req, res) => {
    res.send(subsub.mountpath);
});

sub.get('/', (req, res) => {
    res.send(req.baseUrl);
});

app.get('/', (req, res) => {
    res.end(req.app.locals.title);
});

app.listen(port, host, () => {
    console.log(`listening on: ${host}:${port}`);
});
