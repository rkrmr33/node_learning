const dgram = require('dgram');
const { port, host } = require('../configuration.json');
const logger = { 
    log: require('../../logger')('pingpong:udp:server'),
    err: require('../../logger')('pingpong:udp:server:err'),
};

const logConnection = (connection) => {
    logger.log(`got new connection from: ${connection}`);
};

const logResponse = (connection, resp) => {
    logger.log(`responded with:'${resp}' to: ${connection}`);
}

const logError = (connection, err) => {
    connection ? 
    logger.err(`error with: ${connection}, ${err}`) :
    logger.err(`error: ${err}`);
}

const logData = (connection, data) => {
    logger.log(`${connection} sent: ${data}`);
};

const respond = (socket, port, addr, msg) => {
    const connection = `${addr}:${port}`;

    socket.send(msg, port, addr, (err) => {
        if (err) {
            logError(connection, err);
        } else {
            logResponse(connection, msg);
        }
    });
}

const server = dgram.createSocket('udp4', (data, rinfo) => {
    const resp = 'pong!\r\n';
    const badResp = 'I only know ping son...\r\n';
    const { address, port } = rinfo;
    const connection = `${address}:${port}`;
    const msg = data.toString('utf8');

    logConnection(connection);

    logData(connection, msg);

    if (msg.startsWith('ping')) {
        respond(server, port, address, resp);
    } else {
        respond(server, port, address, badResp);
    }
});

server.on('error', (err) => {
    logError(undefined, err);
});

server.bind(port, host, () => {
    logger.log(`listenning on: ${host}:${port}`);
});