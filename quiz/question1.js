const assert = require('assert');

const isTrans = (s, t) => {
    if (s === t) {
        return true;
    }

    if (t.length === 1) { // can no longer cut t or s, no match...
        return false;
    }

    if (t[0] === t[1] || t[1] === s[0]) { // should continue to cut t
        return isTrans(s, t.substring(1));
    }

    if (s[0] === t[0]) { // continue to cut s and t
        if (s[1] !== t[1] && t[1] !== t[0]) {
            return false;
        }

        return isTrans(s.substring(1), t.substring(1));
    }

    return false;
};

assert.equal(isTrans('abc', 'aaabc'), true);
assert.equal(isTrans('abc', 'abbccc'), true);
assert.equal(isTrans('abc', 'abc'), true);
assert.equal(isTrans('abc', 'abccccc'), true);
assert.equal(isTrans('abc', 'a'), false);
assert.equal(isTrans('abc', ''), false);
assert.equal(isTrans('ab', 'acbbb'), false);
assert.equal(isTrans('ab', 'abbbb'), true);
assert.equal(isTrans('b', 'bccccc'), false);
