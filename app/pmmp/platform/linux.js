'use strict';

const Promise = require('bluebird');
const fs = require('fs-extra');

module.exports = {
    locatePHP() {
        return new Promise((resolve, reject) => {
            fs.exists(`${global.path}/server/bin/php7/bin/php`)
            .then(exists => {
                if(!exists) {
                    global.log.pocketpanel.warn('Could not find php in server/bin/php7/bin. Attempting to fall back to global PHP install.');
                    return resolve('php');
                }
                return resolve(`${global.path}/server/bin/php7/bin/php`);
            });
        });
    },
    locatePocketMine() {
        return new Promise((resolve, reject) => {
            fs.exists(`${global.path}/server/PocketMine-MP.phar`)
            .then(exists => {
                if(!exists) return reject('Could not find PocketMine-MP.phar in your server directory.');
                return resolve(`${global.path}/server/PocketMine-MP.phar`);
            });
        });
    } 
}