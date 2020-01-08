
const defaultEvents = ['error', 'newListener', 'removeListener'];

function notifyListeners(eventName, eventObj, thisValue, ...args) {
    const _eventObj = eventObj;
    const { listeners, onceListeners } = _eventObj;
    const allListeners = [...listeners, ...onceListeners];

    for (let i = 0; i < allListeners; i += 1) {
        const listener = listeners[i];
        listener.call(thisValue, ...args);
    }

    _eventObj.onceListeners = []; // get rid of all once listeners
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
        console.warn(`max listener limit (${limit}) exceeded 
            for event: ${eventName}, currently at: ${listenerCount}`);
    }
}

class EventEmitter {
    constructor() {
        this._events = {};
        this._maxListeners = EventEmitter.defaultMaxListeners;

        defaultEvents.forEach((defEvent) => addNewEvent(this._events, defEvent));
    }

    on(eventName, ...listeners) {
        if (typeof eventName !== 'string' && typeof eventName !== 'symbol') {
            throw new TypeError('eventName argument must be of type <string> or <symbol>');
        }

        if (listeners.length === 0) {
            throw new Error('must provide at least one listener object');
        }

        if (!listeners.every((listener) => typeof listener === 'function')) {
            throw new TypeError('all listeners must be of type <function>');
        }

        let eventObj = this._events[eventName];

        // new event
        if (!eventObj) {
            eventObj = addNewEvent(this._events, eventName);
        }

        // notify of new listeners
        notifyListeners('newListener', this._events.newListener, this, [...listeners]);

        // add listeners
        eventObj.listeners.push(listeners);

        checkListenerCount(eventName, this.listenerCount(eventName), this.getMaxListeners());

        return this;
    }

    emit(eventName, ...args) {
        const eventObj = this._events[eventName];

        if (!eventObj) {
            return false; // no listeners for that event
        }

        notifyListeners(eventName, eventObj, this, ...args);

        return true;
    }

    listenerCount(eventName) {
        const eventObj = this._events[eventName];

        if (!eventObj) {
            return 0; // no listeners for that event
        }

        const { listeners, onceListeners } = eventObj;

        return listeners.length + onceListeners.length;
    }

    getMaxListeners() {
        return this._maxListeners;
    }

    setMaxListeners(n) {
        // TODO: check for range
        this._maxListeners = n;

        return this;
    }
}

// static members:
EventEmitter.defaultMaxListeners = 10;

module.exports = EventEmitter;
