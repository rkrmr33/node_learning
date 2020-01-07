const safeGet = {
    get: function(target, prop, receiver) {
        if (!(prop in target)) {
            target[prop] = new Proxy({}, safeGet);
        }

        return Reflect.get(target, prop, receiver); // delegate to default behavior
    }
};

function Tree() {
    return new Proxy({}, safeGet);
}

const obj = new Tree();

