'use strict';

const fs = require('fs-extra');
const axios = require('axios');
const decompress = require('decompress');
const Promise = require('bluebird');

// TODO: Make this dynamic as opposed to hard-coded.
const PHP_BINARIES = 'https://ci.appveyor.com/api/buildjobs/xuudmh6tm7ib8cav/artifacts/php-7.2.0RC4-vc15-x64.zip';
const PHP_DEBUG = 'https://ci.appveyor.com/api/buildjobs/xuudmh6tm7ib8cav/artifacts/php-debug-pack-7.2.0RC4-Win32-VC15-x64.zip';

class Setup {

    // TODO: Implement rootCaller support.
    constructor(rootCaller) {
        this.getBinaries()
        // TODO: This needs to use a PocketMine updater in the future.
        .then(() => this.downloadFile('https://jenkins.pmmp.io/job/PocketMine-MP/317/artifact/PocketMine-MP_1.7dev-317_0df3b00d_API-3.0.0-ALPHA9.phar', global.path + '/server/PocketMine-MP.phar'))
        .catch(err => {
            throw err;
        });
    }

    downloadFile(url, destination) {
        return new Promise((resolve, reject) => {
            axios.request({
                responseType: 'arraybuffer',
                url: url,
                method: 'get',
                headers: {'Content-Type': 'application/x-sh'}
            }).then(result => {
                fs.writeFileSync(destination, result.data);
                return resolve();
            })
            .catch(err => {
                return reject(err);
            });
        });
    }

    getBinaries() {
        return new Promise((resolve, reject) => {
            global.log.pocketpanel.info('Downloading PHP binaries.');
            this.downloadFile(PHP_BINARIES, `${global.path}/setup/windows/php.zip`).then(() => {
                global.log.pocketpanel.info('Finished downloading PHP binaries.');
                return new Promise((resolve, reject) => {
                    global.log.pocketpanel.info('Downloading PHP debug symbols.');
                    this.downloadFile(PHP_DEBUG, `${global.path}/setup/windows/php-debug.zip`).then(() => {
                        global.log.pocketpanel.info('Finished downloading PHP debug symbols.');
                        return resolve();                        
                    });
                });
            })
            .then(() => {
                global.log.pocketpanel.info('Extracting PHP binaries.');
                decompress(`${global.path}/setup/windows/php.zip`, `${global.path}/server`)
                .then(() => {
                    global.log.pocketpanel.info('Extracting PHP debug symbols.');
                    decompress(`${global.path}/setup/windows/php-debug.zip`, `${global.path}/server/bin/php/symbols`).then(() => resolve());
                });
            });
        });
    }
}

module.exports = Setup;