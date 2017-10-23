'use strict';

const { spawn } = require('child_process');
const fs = require('fs-extra');
const request = require('request');
const decompress = require('decompress');

const PHP_BINARIES = 'https://ci.appveyor.com/api/buildjobs/xuudmh6tm7ib8cav/artifacts/php-7.2.0RC4-vc15-x64.zip';
const PHP_DEBUG = 'https://ci.appveyor.com/api/buildjobs/xuudmh6tm7ib8cav/artifacts/php-debug-pack-7.2.0RC4-Win32-VC15-x64.zip';

class Setup {

    constructor(answers) {
        if(!fs.existsSync(`${global.path}/server`)) {
            global.log.info('Server directory missing, creating it.');
            fs.mkdirSync(`${global.path}/server`);
        }

        if(answers.newServer) {
            this.getBinaries()
                // TODO: This needs to use a PocketMine updater in the future.
                .then(() => this.downloadFile('https://jenkins.pmmp.io/job/PocketMine-MP/317/artifact/PocketMine-MP_1.7dev-317_0df3b00d_API-3.0.0-ALPHA9.phar', global.path + '/server/PocketMine-MP.phar'))
                .then(() => this.copyTemplates())
            .catch((err) => {
                throw err;
            });
        } else {

        }
        //global.logger.info(answers);
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