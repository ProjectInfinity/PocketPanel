'use strict';

const fs = require('fs-extra');
const request = require('request'); // TODO: This needs to be rewritten to use axios instead of request, that way we can finally be rid of the request dependency.
const decompress = require('decompress');
const Promise = require('bluebird');

const PHP_BINARIES = 'https://ci.appveyor.com/api/buildjobs/xuudmh6tm7ib8cav/artifacts/php-7.2.0RC4-vc15-x64.zip';
const PHP_DEBUG = 'https://ci.appveyor.com/api/buildjobs/xuudmh6tm7ib8cav/artifacts/php-debug-pack-7.2.0RC4-Win32-VC15-x64.zip';

class Setup {

    // TODO: Implement rootCaller support.
    constructor(rootCaller) {
        this.getBinaries()
        // TODO: This needs to use a PocketMine updater in the future.
        .then(() => this.downloadFile('https://jenkins.pmmp.io/job/PocketMine-MP/317/artifact/PocketMine-MP_1.7dev-317_0df3b00d_API-3.0.0-ALPHA9.phar', global.path + '/server/PocketMine-MP.phar'))
        .then(() => this.copyTemplates())
        .catch(err => {
            throw err;
        });
    }

    downloadFile(url, destination) {
        return new Promise((resolve, reject) => {
            request({uri: url}).pipe(fs.createWriteStream(destination)).on('close', () => {
                return resolve();
            });
        });
    }

    getBinaries() {
        return new Promise((resolve, reject) => {
            global.log.info('Downloading PHP binaries.');
            this.downloadFile(PHP_BINARIES, `${global.path}/setup/windows/php.zip`).then(() => {
                global.log.info('Finished downloading PHP binaries.');
                return new Promise((resolve, reject) => {
                    global.log.info('Downloading PHP debug symbols.');
                    this.downloadFile(PHP_DEBUG, `${global.path}/setup/windows/php-debug.zip`).then(() => {
                        global.log.info('Finished downloading PHP debug symbols.');
                        return resolve();                        
                    });
                });
            })
            .then(() => {
                global.log.info('Extracting PHP binaries.');
                decompress(`${global.path}/setup/windows/php.zip`, `${global.path}/server`)
                .then(() => {
                    global.log.info('Extracting PHP debug symbols.');
                    decompress(`${global.path}/setup/windows/php-debug.zip`, `${global.path}/server/bin/php/symbols`).then(() => resolve());
                });
            });
        });
    }

    copyTemplates() {
        return new Promise((resolve, reject) => {
            fs.copySync(`${global.path}/setup/windows/template/start.cmd`, `${global.path}/server/start.cmd`, {overwrite: true});
            global.log.info('Copied startup script to server folder.');
            return resolve();
        });
    }
}

module.exports = Setup;