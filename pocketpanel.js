'use strict';

const fs = require('fs-extra');
const async = require('async');
const Promise = require('bluebird');

class PocketPanel {

    constructor() {
        this._pocketmine = new (require('./app/pmmp/server'))(this);
        // TODO: Use crocket instead of restify for communication.
        async.waterfall([
            (callback) => {
                this._pocketmine.folderExists().then(exists => callback(null, exists));
            },
            (exists, callback) => {
                // Server folder exists, prepare to start.
                if(exists) return callback(null);
                // Server folder does not exist, start setup.
                // TODO:
            }
        ], (err) => {
            if(err) throw err;
            // ALL DONE, run other methods to bind all classes together in this file.
            this._pocketmine.prepare().then(() => this._pocketmine.start());
            // TODO: start updater.
            this.pmmp_updater = new (require('./updater/pmmp'))(this);
            this.console_comms = new (require('./app/console/comms'))(this);
        });

        /*if(fs.existsSync(`${global.path}/server`)) {
            // Start PocketPanel.
            let pmmp_updater = require('./updater/pmmp'); // Possible TODO: Make pmmp updater run before system boots.
            let system = require('./app/sys/system');
        } else {
            // Config does not exist, start setup.
            new (require('./setup/inquire'))();
        }*/
    }

    get pocketmine() {
        return this._pocketmine;
    }

}

module.exports = PocketPanel;