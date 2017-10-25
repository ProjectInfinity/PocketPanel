'use strict';
const fs = require('fs-extra');
const Promise = require('bluebird');
const axios = require('axios');

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
            axios.get(this.lastSuccessfulBuildInfo)
            .then(response => {
                if(response.data.build_number > this.current.build_number) {
                    global.log.info(`A new PocketMine version is available. PocketMine-MP ${response.data.pm_version} ${response.data.api_version} (#${response.data.build_number}).`);
                    global.pmmpUpdate = {
                        version: response.data.pm_version, 
                        api: response.data.api_version, 
                        build: response.data.build_number,
                        url: `https://jenkins.pmmp.io/job/PocketMine-MP/lastSuccessfulBuild/artifact/${response.data.job}_${response.data.pm_version}-${response.data.build_number}_${response.data.git_commit.substring(0, 8)}_API-${response.data.api_version}.phar`,
                    };
                }
                return resolve();
            })
            .catch(err => {
                return reject(err);
            });
        });
    }
    
}

module.exports = new PmmpUpdater;