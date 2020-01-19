const express = require('express');
const config = require('../config.json');
const path = require('path');

const { port, host } = config;

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    app.render('index', { title: 'hello', data: 'data' }, (err, html) => {
        if (err) {
            res.send(err.message);
        } else {
            res.send(html);
        }
    });
});

app.listen(port, host, () => {
    console.log(`listening on: ${host}:${port}`);
});
