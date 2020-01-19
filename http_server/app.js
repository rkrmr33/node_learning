const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');

    fs.readFile('./index.html', (err, data) => {
        if (err) {
            res.statusCode = 500;
        } else {
            res.write(data);
        }

        res.end();
    });
});

server.listen(port, () => {
    console.log(`server running on port ${port}`);
});
