const { fibonacci, fibonacciAsync } = require('../math');

describe('testing fibonacci function', () => {
    test('should return the correct number in the fibonnaci sequence', () => {
        expect(fibonacci(0)).toBe(0);
        expect(fibonacci(1)).toBe(1);
        expect(fibonacci(2)).toBe(1);
        expect(fibonacci(3)).toBe(2);
        expect(fibonacci(4)).toBe(3);
        expect(fibonacci(5)).toBe(5);
        expect(fibonacci(6)).toBe(8);

        expect(fibonacci(-1)).toBeUndefined();
    });

    test('load testing summing (0 - 35) fibonnaci - synchronous', () => {
        let sum = 0;

        for (let i = 0; i <= 35; i += 1) {
            sum += fibonacci(i);
        }

        expect(sum).toBe(24157816);
    });

    test('load testing summing (0 - 35) fibonnaci - setImmediate', async () => {
        let sum = 0;
        let finished = 0;
        const TIMES = 20;
    
        const promise = new Promise((res) => {
            for (let i = 0; i <= TIMES; i += 1) {
                // eslint-disable-next-line no-loop-func
                setImmediate(() => {
                    sum += fibonacci(i);
                    ++finished;

                    if (finished === TIMES) {
                        res(sum);
                    }
                });
            }
        });

        const res = await promise;
        expect(res).toBe(10945);
    });

    test('load testing summing (0 - 35) fibonacciAsync', async () => {
        let sum = 0;
        let finished = 0;
        const TIMES = 20;

        const promise = new Promise((res) => {
            for (let i = 0; i <= TIMES; i += 1) {
                // eslint-disable-next-line no-loop-func
                fibonacciAsync(i, (result) => {
                    sum += result;
                    finished += 1;

                    if (finished === TIMES) {
                        res(sum);
                    }
                });
            }
        });

        const res = await promise;
        expect(res).toBe(10945);
    });
});
