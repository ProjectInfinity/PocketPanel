'use strict';

const Promise = require('bluebird');
const ipc = require("crocket")
const client = new ipc();

class ConsoleCommand {

    constructor() {
        this.cli = require('commander');
        this.payload = {}; // We should always return a payload object to the caller.
    }

    send(channel, data = null, listenOn = null) {
        client.connect({ "path": "/tmp/pocketpanel.sock" }, err => { 
            // Connection errors are supplied as the first parameter to callback 
            if(err) throw err; 
            // Instantly a message to the server 
            client.emit(channel, typeof data == 'object' ? JSON.stringify(data) : data);
        });
        return new Promise((resolve, reject) => {
            client.on(listenOn || channel, raw => {
                let response = null;
                try {
                    response = JSON.parse(raw);
                } catch(error) {
                    response = raw;
                }
                if(typeof response != 'object') {
                    console.log(raw);
                    return;
                }
                if(response.instantMessage) console.log(response.message);
                if(response.payload != null) {
                    for(let [key, value] of Object.entries(response.payload)) {
                        this.payload[key] = value;
                    }
                }
            });

            client.on('/hangup', message => {
                client.close();
                return resolve(this.payload);
            });
        });
    }
}

module.exports = ConsoleCommand;