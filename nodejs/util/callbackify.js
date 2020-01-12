function callbackify(fn) {
    return function (...args) {
        const cb = args[args.length - 1];
        const _args = args.slice(0, args.length - 1);

        fn(..._args)
            .then((res) => {
                cb(undefined, res);
            })
            .catch(cb);
    };
}

function testFunc(name) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            rej(new Error('some error'));
        }, 1000);
    });
}

testFunc('roi')
    .then(console.log)
    .catch(console.error);

const callbackified = callbackify(testFunc);

callbackified('roi', (err, res) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(res);
});
