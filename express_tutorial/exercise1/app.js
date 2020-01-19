const express = require('express');
const path = require('path');
const { port, host } = require('../config.json');
const logger = require('./util/logger');

const logMW = require('./util/logger-middleware')('express:server');
const jsonMW = require('./util/json-middleware');
const authMW = require('./util/auth-middleware');

const app = express();

app.use(logMW.log); // must be first to log all requests

app.use(express.static(path.join(__dirname, 'public')));
app.use(jsonMW);
app.use(authMW);

// Routers:
app.use('/users', require('./routes/users')); // mount users router

app.use(logMW.err); // must be last

app.listen(port, host, () => {
    logger.log(`listening on: ${host}:${port}...`);
});
