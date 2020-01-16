const http = require('http');
const url = require('url');
const querystring = require('querystring');
const { fibonacci, fibonacciAsync, fibonacciAsync2 } = require('./fibonacci.cjs');

const currentNanos = () => {
    const hr = process.hrtime();
    return (hr[0] * 1e9 + hr[1]) / 1e6;
};

let reqCounter = 0;

const PORT = 1337;

const handleReqSync = (res, n) => {
    const reqNo = reqCounter;
    const startTime = currentNanos();
    const result = fibonacci(n);

    console.log(`req #${reqNo} took ${(currentNanos() - startTime).toFixed(2)}ms`);

    res.end(result.toString());
};

const handleReqAsync = (res, n) => {
    const reqNo = reqCounter;
    const startTime = currentNanos();

    fibonacciAsync(n, (result) => {
        console.log(`req #${reqNo} took ${(currentNanos() - startTime).toFixed(2)}ms`);

        res.end(result.toString());
    });
};

http.createServer((req, res) => {
    const query = querystring.parse(url.parse(req.url).query);
    const { n } = query;

    if (!n || Number.isNaN(n)) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('you need to specify \'n\' in the query');
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });

        reqCounter += 1;
        console.log('handling request #', reqCounter);
        handleReqSync(res, n);
        // handleReqAsync(res, n);
    }
}).listen(PORT, () => {
    console.log('[+] server listening on [ port', PORT, ']');
});
