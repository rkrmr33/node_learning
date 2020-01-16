const net = require('net');
const { port, host } = require('../configuration.json');
const logger = { 
    log: require('../../logger')('pingpong:tcp:server'),
    err: require('../../logger')('pingpong:tcp:server:err'),
};

const logConnection = (connection) => {
    logger.log(`got new connection from: ${connection.remoteAddress}`);
};

const logResponse = (connection, resp) => {
    logger.log(`responded with:'${resp}' to: ${connection.remoteAddress}`);
}

const logError = (connection, err) => {
    logger.err(`error with: ${connection.remoteAddress}, ${err}`);
}

const logData = (connection, data) => {
    logger.log(`${connection.remoteAddress} sent: ${data}`);
};

const server = net.createServer((socket) => {
    const resp = 'pong!\r\n';
    const badResp = 'I only know ping son...\r\n';

    socket.setEncoding('utf8');

    logConnection(socket);

    socket.on('data', (data) => { 
        logData(socket, data); 

        if (data.startsWith('ping')) {
            socket.end(resp, () => { logResponse(socket, resp) });
        } else {
            socket.write(badResp, () => { logResponse(socket, badResp) });
        }
    });

    socket.on('error', (err) => { logError(socket, err); });
});

server.listen(port, host, () => {
    logger.log(`listenning on: ${host}:${port}`);
});