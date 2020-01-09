
const defaultEvents = ['error', 'newListener', 'removeListener'];

function notifyListeners(eventObj, thisValue, ...args) {
    const _eventObj = eventObj;
    const { listeners, onceListeners } = _eventObj;
    const allListeners = [...listeners, ...onceListeners];

    if (!allListeners.length) {
        return false;
    }

    for (let i = 0; i < allListeners.length; i += 1) {
        const listener = allListeners[i];
        listener.call(thisValue, ...args);
    }

    _eventObj.onceListeners = []; // get rid of all once listeners

    return true;
}

function addNewEvent(events, newEventName) {
    const eventObj = { listeners: [], onceListeners: [] };
    const _events = events;

    _events[newEventName] = eventObj;

    return eventObj;
}

function isEmptyEvent(eventObj) {
    const { listeners, onceListeners } = eventObj;

    return (listeners.length === 0 && onceListeners.length === 0);
}

function checkListenerCount(eventName, listenerCount, limit) {
    if (listenerCount > limit) {
        console.warn(`max listener limit (${limit}) exceeded for event: '${eventName}',`
            + ` currently at: ${listenerCount}. You should probably check for memory leaks.`);
    }
}

function addNewListeners(emitter, eventName, isOnceListeners, ...listeners) {
    if (typeof eventName !== 'string' && typeof eventName !== 'symbol') {
        throw new TypeError('eventName argument must be of type <string> or <symbol>');
    }

    if (listeners.length === 0) {
        throw new Error('must provide at least one listener object');
    }

    if (!listeners.every((listener) => typeof listener === 'function')) {
        throw new TypeError('all listeners must be of type <function>');
    }

    const { _events } = emitter;

    let eventObj = _events[eventName];

    // new event
    if (!eventObj) {
        eventObj = addNewEvent(_events, eventName);
    }

    // notify of new listeners
    notifyListeners(_events.newListener, emitter, eventName, ...listeners);

    // add listeners
    if (isOnceListeners) {
        eventObj.onceListeners.push(...listeners);
    } else {
        eventObj.listeners.push(...listeners);
    }

    checkListenerCount(eventName, emitter.listenerCount(eventName), emitter.getMaxListeners());
}

class EventEmitter {
    constructor() {
        this._events = {};
        this._maxListeners = EventEmitter.defaultMaxListeners;

        defaultEvents.forEach((defEvent) => addNewEvent(this._events, defEvent));
    }

    /**
     * add a listener (or multiple listeners) to a specific event
     * @param {String, Symbol} eventName the name of the event
     * @param  {...Function} listeners at least one listener
     * @returns {EventEmitter} this event emitter
     */
    on(eventName, ...listeners) {
        addNewListeners(this, eventName, false, ...listeners);

        return this;
    }

    /**
     * Add a listener (or multiple listeners) to a specific event.
     * The listener(s) will be removed after a single event has been emitted
     * @param {String, Symbol} eventName the name of the event
     * @param  {...Function} listeners at least one listener
     * @returns {EventEmitter} this event emitter
     */
    once(eventName, ...listeners) {
        addNewListeners(this, eventName, true, ...listeners);

        return this;
    }

    /**
     * emit a specific event and call all of its listeners
     * @param {String, Symbol} eventName the name of the event to be emitted
     * @param  {...any} args any arguments to be passed to the listeners
     * @returns {Boolean} true if there are listeners and false otherwise
     */
    emit(eventName, ...args) {
        const eventObj = this._events[eventName];

        if (!eventObj) {
            return false; // no listeners for that event
        }

        const res = notifyListeners(eventObj, this, ...args);

        if (!res && eventName === 'error') {
            throw new Error('no listeners on \'error\' event');
        }

        if (isEmptyEvent(eventObj) && !defaultEvents.includes(eventName)) {
            delete this._events[eventName]; // remove an event with no listeners (if not default event)
        }

        return true;
    }

    /**
     * @param {String, Symbol} eventName the name of the event
     * @returns {Number} the number of listeners for the specified event
     */
    listenerCount(eventName) {
        const eventObj = this._events[eventName];

        if (!eventObj) {
            return 0; // no listeners for that event
        }

        const { listeners, onceListeners } = eventObj;

        return listeners.length + onceListeners.length;
    }

    /**
     * @returns {Number} the number of max listeners per event for
     * this EventEmitter instance.
     */
    getMaxListeners() {
        return this._maxListeners;
    }

    /**
     * Changes the amount of listeners allowed per event.
     * This is not a hard limit, going beyond the limit simply
     * prints a warning message that might indicate on memory leaks.
     * The given number is truncated to the nearest positive integer.
     * 0 / Infinity meaning unlimited listeners.
     * @param {Number} n the new maximum limit.
     */
    setMaxListeners(n) {
        if (typeof n !== 'number') {
            throw new TypeError('the argument must be of type <number>');
        }

        let _n = Number.parseInt(n, 10);
        if (_n <= 0 || _n > Number.MAX_SAFE_INTEGER) {
            _n = Infinity;
        }

        this._maxListeners = _n;

        return this;
    }

    /**
     * receive a copy on the listeners of the specified event
     * @param {String, Symbol} eventName the name of the event
     * @return {[Function]} returns an array with all the listeners
     * of the specified event
     */
    listeners(eventName) {
        const eventObj = this._events[eventName];

        if (!eventObj) { return []; } // no listeners for that event

        const { listeners, onceListeners } = eventObj;

        return [...listeners, ...onceListeners];
    }
}

// static members:
EventEmitter.defaultMaxListeners = 10;

module.exports = EventEmitter;
