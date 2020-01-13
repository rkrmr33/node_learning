const http = require('http');

const PORT = process.env.PORT || 1337;
const HOST = process.env.HOST || 'localhost';

const sockets = {};

const server = http.createServer((req, res) => {
    console.log(`${req.url} ${JSON.stringify(req.headers)}`);
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
});

server.on('checkContinue', (req, res) => {
    console.log('client sent: 100-Continue');
    res.writeContinue();
});

server.on('connection', (socket) => {
    const name = http.globalAgent.getName(socket);
    console.log(name);
});

server.listen(PORT, HOST, () => {
    console.log(`server listening on: ${HOST}:${PORT}`);
});
