const _module = require('_module');

setTimeout(() => {
    console.log('reached timeout');
}, 0);

const i = setImmediate(() => {
    console.log('reached setImmediate');
});

queueMicrotask(() => {
    console.log('reached microtask');
});

process.nextTick(() => {
    console.log('reached nextTick');
});