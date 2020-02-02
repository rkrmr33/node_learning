process.on('message', (msg) => {
    console.log(`CHILD got: ${msg}`);
    process.send('pong');
});

process.on('disconnect', () => {
    console.log('CHILD parent disconnected');
});

process.on('error', (err) => {
    console.error(`CHILD error: ${err}`);
});

process.on('exit', () => {
    console.log('CHILD exited.');
});
