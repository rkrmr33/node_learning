/* eslint-disable func-names */
const { Socket } = require('net');

const socket = new Socket();

socket.setEncoding('utf8');

socket.on('error', (err) => {
    console.error(`socket encountered an error and must be closed: ${err.errno}`);
});

socket.on('connect', function () {
    console.log(`socket connected to ${this.remoteAddress}`);
});

socket.on('ready', function () {
    this.write('ping');
});

socket.on('data', async function (data) {
    console.log(`received a message from: ${this.remoteAddress}`);
    // eslint-disable-next-line no-restricted-syntax
    console.log(data);
});

socket.connect({ port: 1337, host: 'localhost' });
