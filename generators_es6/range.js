function _defineImmutableProperty(obj, propName, propValue) {
    Object.defineProperty(obj, propName, {
        value: propValue,
        writable: false,
        configurable: false
    });
}

const Range = (function() {
    function Range(from = 0, to = Number.MAX_SAFE_INTEGER, step = 1) {
        _defineImmutableProperty(this, 'from', from);
        _defineImmutableProperty(this, 'to', to);
        _defineImmutableProperty(this, 'step', step);
    }

    Range.prototype[Symbol.iterator] = function* () {
        for (let i = this.from; i < this.to; i += this.step) {
            yield i;
        }
    };

    return Range;
})();

for (let i of new Range(100)) {
    console.log(i);
}