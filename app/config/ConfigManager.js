'use strict';

const fs = require('fs-extra');
const Promise = require('bluebird');
const defaults = require('./defaults.json');
let isReady = false;
let config = {};

class ConfigManager {

    _init() {
        this._loadConfig().then(data => {
            config = data;
            isReady = true;
            //console.log(config);
        });
    }

    _loadConfig() {
        return new Promise((resolve, reject) => {
            fs.exists(`${global.path}/pocketpanel.json`)
            .then(exists => {
                // The config file won't be created if it does not exist. However it will be saved to disk when a change is made.
                if(exists) {
                    let conf = require('./../../pocketpanel.json');
                    return resolve(Object.assign(defaults, conf));
                } else {
                    return resolve(defaults);
                }
            });
        });
    }

    /**
     * Wait until the config is loaded before returning.
     */
    wait() {
        return new Promise((resolve, reject) => {
            this._loadConfig().then(data => {
                config = data;
                isReady = true;
                return Promise.resolve(config);
            }).then(config => {
                // TODO: Save to pocketpanel.json
                fs.writeFile(`${global.path}/pocketpanel.json`, JSON.stringify(config, 0, 4),{encoding: 'utf8'})
                .then(() => resolve(config));
            });
        });
    }

    get config() {
        return config;
    }

}

module.exports = ConfigManager;