'use strict';

const {spawn} = require('child_process');
const Promise = require('bluebird');
const fs = require('fs-extra');
const axios = require('axios');

class Setup {

    constructor(rootCaller) {
        this.downloadScript()
        .then(() => this.runOfficialScript())
        .then(() => rootCaller(null, 'SETUP COMPLETE. Please restart PocketPanel.'))
        .catch(err => {
            throw err;
        });    
    }

    downloadScript() {
        return new Promise((resolve, reject) => {
            axios.request({
                responseType: 'arraybuffer',
                url: 'https://raw.githubusercontent.com/pmmp/php-build-scripts/master/installer.sh',
                method: 'get',
                headers: {'Content-Type': 'application/x-sh'}
            }).then(result => {
                fs.writeFileSync('/tmp/pocketmine_installer.sh', result.data.toString());
                return resolve();
            })
            .catch(err => {
                return reject(err);
            });
        });
    }

    runOfficialScript() {
        return new Promise((resolve, reject) => {
            this.script = spawn('bash', ['/tmp/pocketmine_installer.sh'], {cwd: global.path + '/server'});
            this.script.stdout.on('data', data => {
                global.log.pocketpanel.info(data.toString());
            });
            this.script.on('exit', code => {
                global.log.pocketpanel.info('Installer exit code: ' + code);
                return resolve();
            });
        });
    }

}

module.exports = Setup;