const express = require('express');
const bodyParser = require('body-parser');
const requestLogger = require('./utils/request-logger.js')('express::server');

// routes:
const productRouter = require('./routes/products.js');

// services:
require('./services/mongo.js');

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || 'localhost';

const app = express();

app.use(requestLogger.log);
app.use(bodyParser);

app.use('/products', productRouter);

app.use(requestLogger.err);

app.listen(PORT, HOST, () => {
    console.log(`server listening on: ${HOST}:${PORT}`);
});
