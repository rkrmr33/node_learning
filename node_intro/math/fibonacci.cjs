function fibonacci(n) {
    if (n < 0) { return undefined; }
    if (n < 2) { return n; }

    return (fibonacci(n - 1) + fibonacci(n - 2));
}

function fibonacciAsync(n, callback) {
    if (n < 0) {
        process.nextTick(callback); // call with 'undefined'
    } else if (n < 2) {
        process.nextTick(() => {
            callback(n);
        });
    } else {
        fibonacciAsync(n - 1, (ret1) => {
            fibonacciAsync(n - 2, (ret2) => {
                callback(ret1 + ret2); // holy ****!
            });
        });
       
    }
}

function fibonacciAsync2(n, callback) {
    if (n < 0) {
        process.nextTick(callback); // call with 'undefined'
    } else if (n < 2) {
        process.nextTick(() => {
            callback(n);
        });
    } else {
        process.nextTick(() => {
            fibonacciAsync(n - 1, (ret1) => {
                process.nextTick(() => {
                    fibonacciAsync(n - 2, (ret2) => {
                        callback(ret1 + ret2); // holy ****!
                    });
                });
            });
        });
    }
}

module.exports = { fibonacci, fibonacciAsync, fibonacciAsync2 };
