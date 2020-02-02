const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, { serveClient: false, transports: ['websocket'] });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

io.on('connection', (socket) => {
    console.log('got new ws connection:', socket.conn.remoteAddress);
    socket.emit('newMessage', 'hello client');
});

server.listen(1337, () => {
    console.log('listening on port:', 1337);
});
