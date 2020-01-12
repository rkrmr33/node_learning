const { Server } = require('net');

const server = new Server((socket) => {
    console.log(`got a connection: ${socket.address().address}`);
    socket.setEncoding('utf8');

    socket.on('data', (data) => {
        console.log(`got data from ${socket.remoteAddress}: ${data}`);

        socket.end('pong');
    });
});

server.listen(1337, () => {
    console.log(`server is listening on port ${server.address().port}`);
});
