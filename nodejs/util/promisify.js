function promisify(fn) {
    return function (...args) {
        const _args = args.slice(0, fn.length - 1);

        return new Promise((res, rej) => {
            fn(..._args, (_err, _res) => {
                if (_err) rej(_err);
                else res(_res);
            });
        });
    };
}

function testFunc(name, callback) {
    setTimeout(() => {
        callback(new Error('some error'), name);
    }, 1000);
}

testFunc('roi', (err, res) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(res);
});

const promisified = promisify(testFunc);

promisified('roi')
    .then(console.log)
    .catch(console.error);
