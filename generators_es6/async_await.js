function asyncTask1() {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res('roi');
        }, 2000);
    });
}

function asyncTask2() {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res('neta');
        }, 2000);
    });
}

function asyncTask3() {
    return new Promise((res, rej) => {
        setTimeout(() => {
            rej(new Error('some random error message'));
        }, 2000);
    });
}

function* gen() {
    console.log('starting asynchronous task 1...');
    const name = yield asyncTask1();
    console.log(`received name ${name}`);

    console.log('starting asynchronous task 2...');
    const name2 = yield asyncTask2();
    console.log(`received name ${name2}`);

    console.log('starting asynchronous task 3...');
    try {
        const name3 = yield asyncTask3();
        console.log(`received name ${name3}`);
    } catch (err) {
        console.error(`err: ${err}`);
    }
}

function myAwait(generatorItr, passValue) {
    let result = generatorItr.next(passValue);

    if (!result.done) {
        result.value
            .then((res) => {
                myAwait(generatorItr, res); // pass the result to the yield statement
            })
            .catch((err) => {
                generatorItr.throw(err);
            });
    }
}

myAwait(gen());