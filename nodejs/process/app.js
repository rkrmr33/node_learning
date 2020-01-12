process.on('beforeExit', () => {
    console.log('[+] node.js process exiting...');
});

process.on('exit', () => {
    process.nextTick(() => {
        console.log('reached');
    });
});

process.on('multipleResolves', (resolution, promise, value) => {
    console.warn(`[warning]: spotted multiple resolves
    resolution type: ${resolution}
    promise: ${promise}
    value: ${value}`);
});

const somePromise = () => new Promise((res, rej) => {
    res(1);
    rej(new Error('some error'));
});

const asyncWork = async () => {
    try {
        const result = await somePromise();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
};

asyncWork();
