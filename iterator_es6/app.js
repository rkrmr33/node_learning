const Range = (function() {
    function Range(from = 0, to, step = 1) {
        if (arguments.length < 2) {
            to = from;
            from = 0;
        }

        let current = from;

        Range.prototype[Symbol.iterator] = function() {
            return {
                next() {
                    let done = (current > to);
                    let value = (done ? undefined : current);
                    current += step;

                    return { done, value };
                }
            }
        };
    }

    return Range;
})();

const range = new Range(100);

for (let i of range) {
    console.log(i);
}