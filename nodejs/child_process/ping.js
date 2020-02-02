const { fork } = require('child_process');
const path = require('path');

const child = fork(path.join(__dirname, 'pong.js'));
let times = 10;

child.on('error', (err) => {
    console.error(`PARENT error: ${err}`);
});

child.on('message', (msg) => {
    console.log(`PARENT got: ${msg}`);

    if (times > 0) {
        times -= 1;
        child.send('ping');
    } else {
        console.log('PARENT exiting...');
        child.disconnect();
        child.unref();
    }
});

process.on('exit', () => {
    console.log('PARENT exited.');
});

child.send('ping');
