const net = require('net');
const { port, host } = require('../configuration.json');
const logger = { 
    log: require('../../logger')('pingpong:tcp:client'),
    err: require('../../logger')('pingpong:tcp:client:err'),
};
const input = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const logConnection = (connection) => {
    logger.log(`connected to: ${connection.remoteAddress}`);
};

const logError = (connection, err) => {
    connection.remoteAddress ? 
    logger.err(`error with: ${connection.remoteAddress}, ${err}`) :
    logger.err(`error: ${err}`);
}

const logData = (connection, data) => {
    logger.log(`${connection.remoteAddress} sent: ${data}`);
};

const socket = net.createConnection({
    port,
    host,
});

socket.on('connect', function() {
    logConnection(this);

    input.question('> ', (msg) => {
        this.write(msg);
    });
});

socket.on('error', function(err) {
    logError(this, err);
});

socket.on('data', function(data) {
    logData(this, data);

    input.question('> ', (msg) => {
        this.write(msg);
    });
});

socket.on('close', (hadErr) => {
    if (hadErr) {
        logger.err('connection closed because of an error');
    } else {
        logger.log('connection closed');
    }

    input.close();
});