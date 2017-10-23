'use strict';
const fs = require('fs-extra');
const Promise = require('bluebird');
const request = require('request-promise'); // FIXME: Replace with Axios.

class PmmpUpdater {
    
    constructor() {
        this.lastSuccessfulBuildInfo = 'https://jenkins.pmmp.io/job/PocketMine-MP/lastSuccessfulBuild/artifact/build_info.json';

        this._parseCurrentVersion()
        .then(() => this.checkForUpdate())
        .catch((err) => {
            throw err;
        });
    }

    /**
     * Parses the current pmmp.json file and stores it in {this.current}.
     * If the pmmp.json file exists (build_info.json) it will parse this as opposed to setting the values to null.
     */
    _parseCurrentVersion() {
        return new Promise((resolve, reject) => {
            // Check if the PMMP build_info file exists and parse it, otherwise set values to null.
            fs.exists(`${global.path}/.pocketpanel/pmmp.json`, (exists) => {
                if(!exists) {
                    this.current = {
                        mcpe_version: null,
                        api_version: null,
                        git_commit: null,
                        branch: null,
                        build_number: null,
                        pm_version: null,
                        php_version: null
                    }
                    return resolve();
                } else {
                    fs.readFile(`${global.path}/.pocketpanel/pmmp.json`, (err, content) => {
                        if(err) return reject(err);
                        let data = JSON.parse(content);
                        this.current = data;
                        return resolve();
                    });
                }
            });
        });
    }

    checkForUpdate() {
        return new Promise((resolve, reject) => {
            request(this.lastSuccessfulBuildInfo, (err, response, body) => {
                if(err) throw err;
                if(response && response.statusCode !== 200) {
                    global.log.warn('Failed to check for PocketMine updates. Response status code was not 200.');
                    return reject('Failed to check for PocketMine updates. Response status code was not 200.');
                }
            }).then((data) => {
                let content = JSON.parse(data);
                if(content.build_number > this.current.build_number) {
                    global.log.info(`A new PocketMine version is available. PocketMine-MP ${content.pm_version} ${content.api_version} (#${content.build_number}).`);
                    global.pmmpUpdate = {
                        version: content.pm_version, 
                        api: content.api_version, 
                        build: content.build_number,
                        url: `https://jenkins.pmmp.io/job/PocketMine-MP/lastSuccessfulBuild/artifact/${content.job}_${content.pm_version}-${content.build_number}_${content.git_commit.substring(0, 8)}_API-${content.api_version}.phar`,
                    };
                }
                return resolve();
            });
        });
    }
    
}

module.exports = new PmmpUpdater;