'use strict';

const fs = require('fs-extra');
const ipc = require('crocket');
const socket = new ipc();

class Comms {

    constructor(PocketPanel) {
        this.pocketpanel = PocketPanel;

        socket.listen({'path': '/tmp/pocketpanel.sock'}, err => {
            if(err) throw err;
            global.log.pocketpanel.info('Console comms are up and running.');
        });

        process.on('SIGINT', () => {
            global.log.pocketpanel.warn('Cleaning up and shutting down...');
            socket.close();
            process.exit();
        });

        socket.on('error', err => {
            if(global.os != 'windows' && err.message.includes('EADDRINUSE')) {
                fs.removeSync('/tmp/pocketpanel.sock');
                global.log.pocketpanel.error('PocketPanel was not cleanly shut down and had to do some cleanup. Please restart PocketPanel.');
                process.exit(1);
            }
            global.log.pocketpanel.error('Communication error occurred: ', err); 
        });        
    
        let files = fs.readdirSync(`${global.path}/app/console/api`);
        
        for(let file of files) {
            if(file === 'Response.js') continue;
            new (require(`./api/${file}`))(PocketPanel, socket);
        }
    }

}

module.exports = Comms;