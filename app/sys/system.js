'use strict';


class System {
    constructor(PocketPanel) {
        PocketPanel.get_pocketmine().folderExists().then(res => {console.log(res)});
        // Start the PocketMine server.
        //this._pmmp = require('./../pmmp/server');
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

module.exports = System;