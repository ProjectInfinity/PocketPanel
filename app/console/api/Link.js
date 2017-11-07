'use strict';

const axios = require('axios');
const Promise = require('bluebird');
const Response = require('./Response');

class Link {

    constructor(PocketPanel, socket) {
        this.pocketpanel = PocketPanel;
        this.socket = socket;

        this.listen();
    }

    listen() {
        this.socket.on('/link', payload => {
            this.sendPost(JSON.parse(payload)).then(srvResponse => {
                let response = new Response();
                response.payload = {
                    result: srvResponse
                }
                this.socket.emit('/link', response.stringify());
                this.socket.emit('/hangup');
            }).catch(err => {
                let response = new Response();
                this.socket.emit('/error', err.message);
                this.socket.emit('/hangup');
            });
        });
    }

    sendPost(payload) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'POST',
                url: `${global.config.system.POCKETPANEL_BACKEND}/link`,
                data: {
                    email: payload.email,
                    key: payload.key
                },
                headers: {'User-Agent': 'PocketPanel CLI'}
            }).then(response => {
                return resolve(response.data);
            }).catch(err => {
                return reject(err);
            })
        });
    }

}

module.exports = Link;