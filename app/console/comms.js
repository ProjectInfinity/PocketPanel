'use strict';

const fs = require('fs-extra');
const ipc = require('crocket');
const socket = new ipc();

class Comms {

    constructor(PocketPanel) {
        this.pocketpanel = PocketPanel;

        socket.listen({"path": "/tmp/pocketpanel.sock"}, err => {
            if(err) throw err;
            global.log.pocketpanel.info('Console comms are up and running.');
        });

        socket.on('error', err => { global.log.pocketpanel.error('Communication error occurred: ', err); });        
    
        let files = fs.readdirSync(`${global.path}/app/console/api`);
        
        for(let file of files) {
            if(file === 'Response.js') continue;
            new (require(`./api/${file}`))(PocketPanel, socket);
        }
    }

}

module.exports = Comms;