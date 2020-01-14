const fs = require('fs');
const util = require('util');

const promisifiedOpendir = util.promisify(fs.opendir);

async function doWork() {
    const dir = await promisifiedOpendir(process.cwd());

    const itr = dir[Symbol.asyncIterator]();

    // eslint-disable-next-line no-await-in-loop
    for (let { done, value } = await itr.next(); !done; { done, value } = await itr.next()) {
        console.log(value);
    }
}

doWork();
