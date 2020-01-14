const http = require('http');

const debugErr = require('debug')('proxy_server:error');
const debug = require('debug')('proxy_server:log');

const PORT = process.env.PORT || 80;
const HOST = process.env.HOST || 'localhost';

const TARGET_HOST = process.env.TARGET_HOST || 'www.weevil.info';
const TARGET_PORT = process.env.TARGET_PORT || 80;

const logRequest = (id, req) => {
    debug(`got ${req.method} request from: '${id}, to: '${req.url}'`);
};

const proxy = http.createServer((clientRequest, clientResponse) => {
    const { remoteAddress, remotePort } = clientRequest.connection;
    const clientId = `${remoteAddress}:${remotePort}`;

    logRequest(clientId, clientRequest);

    const requestOpt = {
        host: TARGET_HOST,
        port: TARGET_PORT,
        method: clientRequest.method,
        path: clientRequest.url,
    };

    const proxyRequest = http.request(requestOpt);

    proxyRequest.on('response', (proxyResponse) => {
        const { statusCode, statusMessage } = proxyResponse;
        debug(`got response for ${clientId} with status: ${statusCode} ${statusMessage}, piping response...`);

        proxyResponse.on('end', () => {
            debug(`finished piping response to ${clientId}`);
        });

        proxyResponse.pipe(clientResponse);
    });

    proxyRequest.on('error', (err) => {
        debugErr(`encountered error while handling request from '${clientId}':`, err);

        clientResponse.destroy(err); // close connection to client
    });

    // write the request to the target server
    clientRequest.pipe(proxyRequest);
});

proxy.on('error', (err) => {
    debugErr('proxy server encountered an error: ', err);
});

proxy.listen(PORT, HOST, () => {
    debug(`proxy server is listenning on: ${HOST}:${PORT}`);
});
