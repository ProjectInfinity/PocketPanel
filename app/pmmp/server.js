'use strict';

const {spawn} = require('child_process');
const platform = require('./platform/' + global.os);

class Server {

    constructor() {
        platform.locatePHP()
        .then(phpPath => {
            this.php = phpPath;
        })
        .then(platform.locatePocketMine.bind(this))
        .then(pharPath => {
            this.phar = pharPath;
        })
        .then(this.start.bind(this))
        .catch(err => {
            global.log.error(err);
            process.exit(1);
        });
    }

    /**
     * Starts the PocketMine server.
     */
    start() {
        this.pmmp = spawn(this.php, [this.phar], {cwd: global.path + '/server'});
        this.pmmp.stdout.on('data', data => {
            global.log.info(data.toString());
        });
        this.pmmp.stdout.on('end', data => {
            global.log.info(data);
        });
        this.pmmp.on('exit', code => {
            global.log.info('Exit code: ' + code);
        });
    }

}

module.exports = new Server;