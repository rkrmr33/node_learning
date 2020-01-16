const math = require('../math');

const { factorial, power } = math;

describe('testing calc functions', () => {
    test('testing existence of functions', () => {
        expect(typeof factorial).toBe('function');
        expect(typeof power).toBe('function');
    });

    test('testing factorial', () => {
        expect(factorial(-1)).toBe(-1);
        expect(factorial(0)).toBe(-1);

        expect(factorial(1)).toBe(1);
        expect(factorial(2)).toBe(2);
        expect(factorial(3)).toBe(6);
        expect(factorial(4)).toBe(24);
    });

    test('testing power', () => {
        expect(power(2, 3)).toBe(8);

        expect(power(1, 1)).toBe(1);
        expect(power(1, 0)).toBe(1);
    });
});