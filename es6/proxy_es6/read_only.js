function denyModification() {
    throw new TypeError('cannot modify this object, this object is read-only!');
}

const readOnlyHandler = {
    set: denyModification,
    defineProperty: denyModification,
    setPrototypeOf: denyModification,
    preventExtensions: denyModification,
    deleteProperty: denyModification,
    get: function(target, prop, receiver) {
        const result = Reflect.get(target, prop, receiver);
        if (typeof result === 'object' || 
            typeof result === 'function' && 
            null !== result) {
            return makeReadOnly(result);
        }
        return result;
    },
    getPrototypeOf: function(target) {
        const result = Reflect.getPrototypeOf(target);
        if (null !== result) {
            return makeReadOnly(result);
        }
        return result;
    },
    getOwnPropertyDescriptor: function(target, prop) {
        const result = Reflect.getOwnPropertyDescriptor(target, prop);
        if (null !== result) {
            return makeReadOnly(result);
        }
        return result;
    }
};

function makeReadOnly(obj) {
    return new Proxy(obj, readOnlyHandler);
}

let readOnlyMath = makeReadOnly(Math);