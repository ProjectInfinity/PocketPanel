'use strict';

const Promise = require('bluebird');
const fs = require('fs-extra');

module.exports = {
    locatePHP() {
        return new Promise((resolve, reject) => {
            fs.exists(`${global.path}/server/bin/php/php.exe`)
            .then(exists => {
                if(!exists) {
                    global.log.pocketpanel.warn('Could not find php.exe in server/bin/php. Attempting to fall back on global PHP install.');
                    return resolve('php');
                }
                return resolve(`${global.path}/server/bin/php/php.exe`);
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