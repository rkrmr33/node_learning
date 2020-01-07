const Counter = (function() {
    const counterProp = Symbol('counterProp');

    function Counter() {
        this[counterProp] = 0;
    }

    Counter.prototype.inc = function() {
        return this[counterProp]++;
    }

    Counter.prototype.getCount = function() {
        return this[counterProp];
    }

    return Counter;
})();

const counter = new Counter();

console.log(counter);