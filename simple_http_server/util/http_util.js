
const readBody = (req) => new Promise((res, rej) => {
    let body = '';

    req.setEncoding('utf8');

    req.on('data', (chunk) => {
        body += chunk;
    });

    req.on('end', () => {
        res(body);
    });

    req.on('error', (err) => {
        rej(err);
    });
});

module.exports = {
    readBody,
};
