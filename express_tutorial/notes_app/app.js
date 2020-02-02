const express = require('express');
const cookieParser = require('cookie-parser');
const { port, host } = require('../config.json');
const logger = require('./util/logger');
const jsonParser = require('./util/json-middleware');
const loggerMW = require('./util/logger-middleware.js')('express:notes:app');
const authMW = require('./util/auth-middleware.js');

// routers:
const notesRouter = require('./routes/notes.js');
const usersRouter = require('./routes/users.js');

const app = express();
app.use(loggerMW.log);
app.use(cookieParser());
app.use(jsonParser);
app.use(authMW);

app.use('/users', usersRouter);
app.use('/notes', notesRouter);

app.use(loggerMW.err);

app.listen(port, host, () => {
    logger.log(`server listening on: ${host}:${port}`);
});
