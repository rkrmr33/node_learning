/* eslint-disable global-require */
const http = require('http');
const urlParser = require('url');
const config = require('./config.json');
const logger = require('./util/logger.js');

const PORT = process.env.PORT || config.port;
const HOST = process.env.HOST || config.host;

const usersRouter = require('./routes/users.js');
const usersLoginRouter = require('./routes/users_login.js');

process.on('uncaughtException', (err) => {
    logger.err('Uncaught error,', err);
});

process.on('unhandledRejection', (rej) => {
    logger.err('Unhandled rejection, reason: ', rej);
});

const routers = [
    usersRouter,
    usersLoginRouter,
];

const handleRequest = (router, req, res) => {
    const { method } = req;
    let handler;

    switch (method) {
        case 'GET':
            handler = router.get;
            break;
        case 'POST':
            handler = router.post;
            break;
        case 'PATCH':
            handler = router.patch;
            break;
        case 'DELETE':
            handler = router.delete;
            break;
        case 'PUT':
            handler = router.put;
            break;
        default:
            handler = undefined;
    }

    if (!handler) {
        res.writeHead(400);
        res.end();
    } else {
        handler(req, res);
    }
};

const server = http.createServer((req, res) => {
    const path = urlParser.parse(req.url).pathname.toLowerCase();
    let router;

    logger.logRequest(req);

    for (let i = 0; i < routers.length; i += 1) {
        const cur = routers[i];

        if (path === cur.path) {
            router = cur;
            break;
        }
    }

    if (!router) {
        res.writeHead(404);
        res.end();
    } else {
        handleRequest(router, req, res);
    }
});

server.listen(PORT, HOST, () => {
    logger.log('server listening on:', HOST, PORT);
});
