// function* gen(to) {
//     for (let i = 0; i < to; ++i) {
//         yield i;
//     }
// }

// for (let i of gen(10)) {
//     console.log(i);
// }

/* MAKING AN OBJECT ITERABLE WITH MIXIN */
Object.defineProperty(Object.prototype, Symbol.iterator, {
    value: function*() {
        for (let prop in this) {
            yield this[prop];
        }
    },
    enumerable: false,
    writable: false
});

const obj = { a:1, b:2, c:3, d:4, e:5 };

for (let val of obj) {
    console.log(val);
}
