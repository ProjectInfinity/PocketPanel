'use strict';

const fs = require('fs-extra');
const getPort = require('get-port');

class Server {

    constructor() {
        if(!fs.existsSync(`${global.path}/.pocketpanel/api_token`)) fs.writeFileSync(`${global.path}/.pocketpanel/api_token`, require('crypto').createHash('sha256').update(`${(new Date).getTime()}${process.pid}`).digest('hex'));
        this.restify = require('restify');
        this.server = this.restify.createServer();
        global.api_token = fs.readFileSync(`${global.path}/.pocketpanel/api_token`).toString();
    
        new (require('./routes'))(this.server, this.restify);

        getPort({port: global.config.api_port, host: '127.0.0.1'}).then(port => {
            if(port !== global.config.api_port) global.log.info(`The internal API attempted to use port ${global.config.api_port} which is occupied, using port ${port} instead.`);
            this.server.listen(port, 'localhost', () => {
                global.log.pocketpanel.info(`Internal API listening at ${this.server.url}`);
            });
            fs.writeFile(`${global.path}/.pocketpanel/api_port`, port);
        });
        
        // Regenerate API token every 30 mins.
        setInterval(() => {
            let token = require('crypto').createHash('sha256').update(`${(new Date).getTime()}${process.pid}`).digest('hex');
            fs.writeFileSync(`${global.path}/.pocketpanel/api_token`, token);
            global.api_token = token;
        }, 1800000);
    }

}

module.exports = new Server;