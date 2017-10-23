'use strict';

const Promise = require('bluebird');

class System {
    constructor() {
        // Start the PocketMine server.
        this._pmmp = require('./../pmmp/server');
        // Start the internal API.
        this._api = require('./api/server');
    }

    get pocketmine() {
        return this._pmmp;
    }

    get api() {
        return this._api;
    }
}

module.exports = new System;