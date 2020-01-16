const _module = require('_module');


const i = setImmediate(() => {
    console.log('reached setImmediate');
});

setTimeout(() => {
    console.log('reached timeout');
    setTimeout(() => {
        console.log('2 timeout');
    }, 0);

    process.nextTick(() => {
        console.log('2 tick');
    });
}, 0);

queueMicrotask(() => {
    console.log('reached microtask');
});

process.nextTick(() => {
    console.log('reached nextTick');
});
