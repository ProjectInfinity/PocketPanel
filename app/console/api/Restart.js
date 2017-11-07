'use strict';

const Response = require('./Response');
const Promise = require('bluebird');

class Restart {

    constructor(PocketPanel, socket) {
        this.pocketpanel = PocketPanel;
        this.socket = socket;
        this.pocketmine = PocketPanel.pocketmine;

        this.restartServer();
    }

    restartServer() {
        // TODO: Clean up this process, it should emit a message on every instance like start, stop etc.
        this.socket.on('/server/restart', payload => {
            this.pocketmine.restart().then(srvResponse => {
                let response = new Response();
                response.instantMessage = true;
                response.message = 'Server should be restarted now yo.';
                this.socket.emit('/server/restart', response.stringify());
                this.socket.emit('/hangup');
            }).catch(err => {
                let response = new Response();
                this.socket.emit('/error', err.message);
                this.socket.emit('/hangup');
                console.error(err);
            });
        });
    }

}

module.exports = Restart;