const http = require('http');
const fs = require('fs');
const path = require('path');
const { PassThrough } = require('stream');
const debug = require('debug')('mymodule:downloadfile');
const prettyBytes = require('pretty-bytes');

const src = 'http://iobio.io/public/images/blog/fibridge_banner.png'; // put the url for the resource here
const filename = `data${path.extname(src)}`; // put the wanted file name here

let totalSize;
let curSize = 0;

const percentage = (cur, total) => `${((cur / total) * 100).toFixed(2)} %`;

function logData(chunk) {
    curSize += chunk.length;

    debug(`downloaded a chunk of ${prettyBytes(chunk.length)} [total: ${prettyBytes(curSize)}] [${percentage(curSize, totalSize)}]`);
}

debug(`requesting: ${src}`);

http.get(src, (res) => {
    const { statusCode, statusMessage } = res;
    totalSize = Number(res.headers['content-length']);

    debug(`got response headers from host, resource is [${prettyBytes(totalSize)}]`);

    if (statusCode !== 200) {
        debug(`GET request failed with status: ${statusCode}, ${statusMessage}`);

        return;
    }

    res.on('end', () => {
        console.log('finished downloading the file');
    });

    const fileStream = fs.createWriteStream(filename, { flags: 'w' });

    fileStream.on('error', (err) => {
        debug('error with file stream: ', err);
    });

    res.pipe(new PassThrough().on('data', logData));
    res.pipe(fileStream);
}).on('error', (err) => {
    debug(`could not GET '${src}' because: ${err}`);
});
