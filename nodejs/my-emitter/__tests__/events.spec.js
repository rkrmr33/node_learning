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
        });
    });
});
