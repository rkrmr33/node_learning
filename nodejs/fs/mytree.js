/* eslint-disable no-restricted-syntax */
const fs = require('fs');

const path = process.argv[2] || process.cwd();

async function printTree(dir, indent = 0) {
    const dirObj = await fs.promises.opendir(dir);
    const indentStr = new Array(indent).fill(' ').join('');
    const entries = [];

    for await (const dirent of dirObj) {
        entries.push(dirent);
    }

    for (const entry of entries) {
        console.log(`${indentStr}${entry.name}`);
        if (entry.isDirectory()) {
            // eslint-disable-next-line no-await-in-loop
            await printTree([dir, entry.name].join('/'), indent * 2);
        }
    }
}

fs.promises.stat(path)
    .then((stat) => {
        if (stat.isDirectory()) {
            console.log(path);

            printTree(path, 4);
        } else {
            console.error('the given path is a file path, directory path is needed!');
        }
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
