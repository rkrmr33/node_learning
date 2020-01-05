function* gen() {
    let i = 0
    while(true) {
        i = yield (i + 1);
    }
}

const itr = gen();
