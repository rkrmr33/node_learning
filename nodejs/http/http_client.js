const http = require('http');

const request = http.request({
    host: 'localhost',
    port: 1337,
    agent: false,
});

request.setHeader('Expect', '100-Continue');

request.on('abort', () => {
    console.log('request was aborted');
});

request.on('connect', (res) => {
    console.log(`got response for CONNECT request: ${res}`);
});

request.on('error', console.error);

request.on('response', (res) => {
    console.log(`got response headers: ${JSON.stringify(res.headers)}`);

    res.on('data', (data) => {
        console.log(`got data: ${data.toString('utf8')}`);
    });
});

request.on('continue', () => {
    console.log('got continue instruction');
    request.end('hello');
});

request.on('information', (info) => {
    console.log(`got info from server: ${JSON.stringify(info)}`);
});

request.flushHeaders();
