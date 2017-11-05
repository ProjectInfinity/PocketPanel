'use strict';

class Response {
    constructor(options = {
        instantMessage: false,
        message: null,
        payload: null
    }) {
        this._options = Object.assign({
            instantMessage: false,
            message: null,
            payload: null
        }, options);
    }

    set instantMessage(should) {
        this._options.instantMessage = should;
    }

    set message(message) {
        this._options.message = message;
    }

    get message() {
        return this._options.message;
    }

    set payload(payload) {
        this._options.payload = payload;
    }

    get payload() {
        return this._options.payload;
    }

    stringify() {
        return JSON.stringify(this._options);
    }

    json() {
        return this._options;
    }
}

module.exports = Response;