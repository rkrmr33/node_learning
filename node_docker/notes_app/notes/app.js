const express = require('express');
const cookieParser = require('cookie-parser');
const jsonParser = require('./util/json-middleware');
const logger = require('./util/logger');
const loggerMW = require('./util/logger-middleware.js')('express:notes:app');
const authMW = require('./util/auth-middleware.js');

const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || 'localhost';

// routers:
const notesRouter = require('./routes/notes.js');

const app = express();
app.use(loggerMW.log);
app.use(cookieParser());
app.use(jsonParser);
app.use(authMW);

app.use('/notes', notesRouter);

app.use(loggerMW.err);

app.listen(PORT, HOST, () => {
    logger.log(`server listening on: ${HOST}:${PORT}`);
});
