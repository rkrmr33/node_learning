const fs = require('fs');

const readStream = fs.createReadStream('./somefile.txt');

readStream.on('open', (fd) => {
    console.log(`${fd} is ready to be read`);
});

readStream.on('ready', async function () {
    const chunk = await this.read();
    console.log(`processing chunk: ${chunk}`);
});
