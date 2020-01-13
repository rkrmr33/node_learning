const http = require('http');
const fs = require('fs');
const path = require('path');
const debug = require('debug')('mymodule:downloadfile');

const src = 'http://iobio.io/public/images/blog/fibridge_banner.png'; // put the url for the resource here
const filename = `data${path.extname(src)}`; // put the wanted file name here

debug(`requesting: ${src}`);

http.get(src, (res) => {
    const { statusCode, statusMessage } = res;
    const totalSize = res.headers['content-length'];
    let curSize = 0;

    debug(`got response headers from host, resource is [${(totalSize / 1024).toFixed(2)}kb]`);

    if (statusCode !== 200) {
        debug(`GET request failed with status: ${statusCode}, ${statusMessage}`);

        return;
    }

    res.on('end', () => {
        res.destroy();

        console.log('finished downloading the file');
    });

    const stream = fs.createWriteStream(filename, { flags: 'w' });

    stream.on('error', (err) => {
        debug('error with file stream: ', err);
    });

    stream.on('open', () => {
        res.on('data', (chunk) => {
            curSize += chunk.length;
            debug(`downloaded a chunk of ${(chunk.length / 1024).toFixed(2)} `
                + `kb [total: ${(curSize / 1024).toFixed(2)}kb] [${((curSize / totalSize) * 100).toFixed(2)} %]`);
        });
        res.pipe(stream);
    });
}).on('error', (err) => {
    debug(`could not GET '${src}' because: ${err}`);
});
