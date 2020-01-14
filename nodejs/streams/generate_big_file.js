const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const prettyBytes = require('pretty-bytes');
const input = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
});

const DEF_SIZE = 1e6;
const DEF_FILENAME = './data.big';

let curSize = 0;

function fillFileBuffer(stream, size, garbage = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa') {
    while (curSize < size) {
        curSize += garbage.length;
        if (!stream.write(garbage)) {
            return; // wait for 'drain'
        }
    }
}

function generateFile(filename, size, garbage) {
    return new Promise((res, rej) => {
        const fileStream = fs.createWriteStream(filename, { flags: 'w' });
        fileStream.setDefaultEncoding('utf8');

        fileStream.on('open', () => {
            fileStream.on('drain', () => {
                fillFileBuffer(fileStream, size, garbage); // continue filling
                if (curSize >= size) {
                    fileStream.close();
                    res();
                }
            });

            console.log('writing to file...');
            fillFileBuffer(fileStream, size, garbage);
            if (curSize >= size) {
                fileStream.close();
                res();
            }
        });

        fileStream.on('error', (err) => {
            fileStream.close();

            rej(err);
        });
    });
}

function getArg(argName) {
    const index = process.argv.indexOf(argName);

    return index === -1 ? undefined : process.argv[index + 1];
}

function questionAsync(question) {
    return new Promise((res) => {
        input.question(question, res);
    });
}

async function start() {
    const filename = getArg('--filename') || DEF_FILENAME;
    const size = Number(getArg('--size')) || DEF_SIZE;
    const garbage = getArg('--garbage');

    try {
        const fullFilename = path.resolve(__dirname, filename);
        const exists = fs.existsSync(fullFilename);

        if (exists) {
            const answer = await questionAsync(`file '${filename}' already exists, do you want to overwrite (y/n)? `);

            if (answer !== 'yes' && answer !== 'y') {
                console.log('aborting...');
                process.exit(1);
            }
        }

        console.log(`createing ${prettyBytes(size, {})} bytes '${filename}'...`);
        await generateFile(fullFilename, size, garbage);
        console.log(`done creating file with ${prettyBytes(size)}`);
    } catch (err) {
        console.error(err);
    }
}

start()
    .catch(console.error)
    .finally(() => {
        input.close();
    });
