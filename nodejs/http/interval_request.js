const http = require('http');

const agent = http.Agent({
    keepAlive: true,
    keepAliveMsecs: 300,
    maxSockets: 4,
});

const requestOps = {
    host: 'localhost',
    port: 1337,
    agent,
};

let repeats = 4;

function makeRequest() {
    const request = http.request(requestOps, (res) => {
        res.on('data', (chunk) => {

        });

        res.on('error', console.error);

        res.on('end', () => {
            console.log('got response from server');

            if (repeats > 0) {
                repeats -= 1;
                makeRequest();
            }
        });
    });

    request.on('error', console.error);

    request.on('socket', (socket) => {
        socket.on('connect', () => {
            console.log('socket connected');
        });

        socket.on('close', (hadErr) => {
            console.log(`socket closed: ${agent}`);
        });
    });

    request.end('hello, world');
}

makeRequest();
