const dgram = require('dgram');
const { port, host } = require('../configuration.json');
const logger = { 
    log: require('../../logger')('pingpong:udp:client'),
    err: require('../../logger')('pingpong:udp:client:err'),
};
const input = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

const logConnection = (connection) => {
    logger.log(`connected to ${connection}`);
};

const logSent = (resp) => {
    logger.log(`sent: ${resp}`);
};

const logError = (connection, err) => {
    connection ? 
    logger.err(`error with: ${connection}, ${err}`) :
    logger.err(`error: ${err}`);
};

const logData = (connection, data) => {
    logger.log(`${connection} sent: ${data}`);
};

const respond = (socket, connection, msg) => {
    socket.send(msg, (err) => {
        if (err) {
            logError(connection, err);
        } else {
            logSent(msg);
        }
    });
};

const client = dgram.createSocket('udp4');

client.on('message', (msg, rinfo) => {
    const { address, port } = rinfo;
    const connection = `${address}:${port}`;

    logData(connection, msg.toString('utf8'));

    input.question('> ', (msg) => {
        respond(client, connection, msg);
    });
});

client.on('error', (err) => {
    logError(undefined, err);
});

client.connect(port, host, () => {
    const connection = `${host}:${port}`;
    logConnection(connection);

    input.question('> ', (msg) => {
        respond(client, connection, msg);
    });
});
