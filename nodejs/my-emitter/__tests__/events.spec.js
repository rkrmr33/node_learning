const EventEmitter = require('../EventEmitter.js');

describe('EventEmitter Tests', () => {
    /**
     * EventEmitter class
     */
    describe('EventEmitter basic class tests', () => {
        test('should be able to import the EventEmitter class', () => {
            expect(typeof EventEmitter).toBe('function');
        });

        test('should be able to create a new instance of EventEmitter', () => {
            const emitter = new EventEmitter();

            expect(emitter).toBeTruthy();
        });

        test('should not be able to call EventEmitter as a function', () => {
            expect(EventEmitter).toThrow();
        });
    });

    /**
     * emitter.on()
     */
    describe('testing emitter.on() method', () => {
        test('should add a new Listener to default events', () => {
            const emitter = new EventEmitter();

            expect(emitter.listenerCount('error')).toBe(0);
            expect(emitter.listenerCount('newListener')).toBe(0);
            expect(emitter.listenerCount('removeListener')).toBe(0);

            emitter.on('error', () => {});
            emitter.on('newListener', () => {});
            emitter.on('removeListener', () => {});

            expect(emitter.listenerCount('error')).toBe(1);
            expect(emitter.listenerCount('newListener')).toBe(1);
            expect(emitter.listenerCount('removeListener')).toBe(1);

            emitter.on('error', () => {});
            expect(emitter.listenerCount('error')).toBe(2);
        });

        test('should add a new listener and create new event', () => {
            const emitter = new EventEmitter();
            expect(emitter.listenerCount('test')).toBe(0);

            emitter.on('test', () => {});
            expect(emitter.listenerCount('test')).toBe(1);

            emitter.on('test', () => {});
            expect(emitter.listenerCount('test')).toBe(2);
        });

        test('should return the same emitter', () => {
            const emitter = new EventEmitter();
            const emitter2 = emitter.on('x', () => {});

            expect(emitter2).toEqual(emitter);
        });

        test('try wrong argument types', () => {
            const emitter = new EventEmitter();

            expect(() => {
                emitter.on(1, () => {});
            }).toThrowError(new TypeError('eventName argument must be of type <string> or <symbol>'));

            expect(() => {
                emitter.on('asd');
            }).toThrowError(new Error('must provide at least one listener object'));

            expect(() => {
                emitter.on('asd', () => {}, 1);
            }).toThrowError(new TypeError('all listeners must be of type <function>'));
        });

        test('should print max listeners acceeded warning message to console.warn', () => {
            let warningMessage;
            const consoleWarnMock = (msg) => { warningMessage = msg; };
            const consoleWarn = console.warn;
            const emitter = new EventEmitter();
            const limit = emitter.getMaxListeners();
            const eventName = 'error';

            console.warn = consoleWarnMock;

            for (let i = 0; i < limit + 1; i += 1) {
                emitter.on(eventName, () => {});
            }

            expect(warningMessage).toBe(`max listener limit (${limit}) exceeded for event: '${eventName}',`
            + ` currently at: ${limit + 1}. You should probably check for memory leaks.`);

            console.warn = consoleWarn;
        });
    });

    /**
     * emitter.once()
     */
    describe('testing emitter.once() method', () => {
        test('should be able to add once listener', () => {
            const emitter = new EventEmitter();
            let wasCalled = false;
            expect(emitter.listenerCount('test')).toBe(0);

            emitter.once('test', () => { wasCalled = true; });
            expect(emitter.listenerCount('test')).toBe(1);

            emitter.emit('test');
            expect(wasCalled).toBeTruthy();
        });

        test('should remove once listener after one emission', () => {
            const emitter = new EventEmitter();

            emitter.once('test', () => {});
            emitter.emit('test');
            expect(emitter.listenerCount('test')).toBe(0);
        });
    });

    /**
     * emitter.emit()
     */
    describe('testing emitter.emit() method', () => {
        test('should return false when emitting empty event', () => {
            const emitter = new EventEmitter();

            const result = emitter.emit('x');
            expect(result).toBeFalsy();
        });

        test('should return true when emitting event with listeners', () => {
            const emitter = new EventEmitter();

            emitter.on('x', () => {});

            const result = emitter.emit('x');
            expect(result).toBeTruthy();
        });

        test('should call the listener', () => {
            const emitter = new EventEmitter();
            let count = 0;

            emitter.on('test', () => { count += 1; });
            expect(emitter.listenerCount('test')).toBe(1);

            emitter.emit('test');

            expect(count).toBe(1);
        });

        test('should notify on \'newListener\'', () => {
            const emitter = new EventEmitter();
            let reached = false;
            const listener = () => {};

            emitter.on('newListener', (eventName, ...listeners) => {
                expect(eventName).toBe('test');
                expect(listeners[0]).toBe(listener);
                reached = true;
            });

            emitter.on('test', listener);

            expect(reached).toBeTruthy();
        });

        test('should crash the process (no listeners on \'error\' event)', () => {
            const emitter = new EventEmitter();

            expect(() => {
                emitter.emit('error');
            }).toThrowError(new Error('no listeners on \'error\' event'));
        });
    });

    /**
     * emitter.setMaxListeners() and emitter.getMaxListeners()
     */
    describe('testing emitter.setMaxListener() & emitter.getMaxListener() methods', () => {
        test('should initially be equal to the default amount', () => {
            const emitter = new EventEmitter();

            const res = emitter.getMaxListeners();
            expect(res).toBe(EventEmitter.defaultMaxListeners);
        });

        test('should change the amount of max listener only for one instance', () => {
            const emitter1 = new EventEmitter();
            const emitter2 = new EventEmitter();
            const newMaxListeners = 5;

            emitter1.setMaxListeners(newMaxListeners);
            expect(emitter1.getMaxListeners()).toBe(newMaxListeners);

            expect(emitter2.getMaxListeners()).toBe(EventEmitter.defaultMaxListeners);
        });

        test('should throw TypeError when passing non number types', () => {
            const emitter = new EventEmitter();

            expect(() => {
                emitter.setMaxListeners('asd');
            }).toThrowError(new TypeError('the argument must be of type <number>'));
        });

        test('should truncate to nearest, non-negative, integer', () => {
            const emitter = new EventEmitter();

            emitter.setMaxListeners(11.5);
            expect(emitter.getMaxListeners()).toBe(11);

            emitter.setMaxListeners(-1);
            expect(emitter.getMaxListeners()).toBe(Infinity);
        });
    });

    /**
     * emitter.listeners()
     */
    describe('testing emitter.listeners() method', () => {
        test('should return an empty array on empty event', () => {
            const emitter = new EventEmitter();

            const listeners = emitter.listeners('error');

            expect(Array.isArray(listeners)).toBeTruthy();
            expect(listeners.length).toBe(0);
        });

        test('should return an empty array on non-existing event', () => {
            const emitter = new EventEmitter();

            const listeners = emitter.listeners('test');

            expect(Array.isArray(listeners)).toBeTruthy();
            expect(listeners.length).toBe(0);
        });

        test('should return a copy and not the original array', () => {
            const emitter = new EventEmitter();

            emitter.on('test', () => {});
            emitter.on('test', () => {});
            emitter.once('test', () => {});

            const listeners = emitter.listeners('test');

            expect(listeners.length).toBe(3);
            expect(emitter.listenerCount('test')).toBe(3);

            listeners.push(() => {});
            expect(emitter.listenerCount('test')).toBe(3);
        });
    });
});
