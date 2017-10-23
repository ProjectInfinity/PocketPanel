'use strict';

const axios = require('axios');
const Promise = require('bluebird');

class ConsoleCommand {

    constructor() {
        this.cli = require('commander');
    }

    call(options = {}) {
        let o = {
            method: options.method || 'POST',
            uri: options.url || `http://127.0.0.1:${global.api_port}/`,
            headers: {
                'User-Agent': 'PocketPanel CLI v' + global.pp_version,
                'X-API-Auth': global.api_token
            },
            body: options.body || {},
            params: options.params || {}
        }
        //console.log(o);
        return new Promise((resolve, reject) => {
            axios({
                method: o.method,
                url: o.uri,
                params: o.params,
                data: o.body,
                headers: o.headers
            }).then(response => {
                return resolve(response.data);
            }).catch(err => {
                // TODO: Need to create a error handling library for this.
                if(err.code !== undefined && err.code === 'ECONNREFUSED') {
                    console.log('\n    Could not reach the API. Is PocketPanel running?');
                    process.exit(1);
                }
                if(err.request != undefined) {
                    if(err.request.res !== undefined && err.request.res.statusCode === 403) {
                        console.log('\nAPI authentication error.');
                        process.exit(1);
                    }
                }
                if(err.status !== undefined && err.status == 403) return reject('ERROR: API request could not be validated.');
                console.log(`
    An error occurred while performing an action! 
                
    Cause: ${err.message}

    PocketPanel may no longer be running!`);
                process.exit(1);
            });
        })
    }
}

module.exports = ConsoleCommand;