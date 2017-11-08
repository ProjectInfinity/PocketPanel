'use strict';

const {spawn} = require('child_process');
const platform = require('./platform/' + global.os);
const isRunning = require('is-running');
const Promise = require('bluebird');
const fs = require('fs-extra');

class Server {

    constructor(PocketPanel) {
        this.pocketpanel = PocketPanel;
        global.log.pmmp = require('logging').default('PocketMine');
    }


    folderExists() {
        return new Promise((resolve, reject) => {
            fs.exists(`${global.path}/server`, exists => {
                return resolve(exists);
            });
        });
    }

    /**
     * This finds the PHP binaries location as well as the PocketMine phar location
     * and stores it to prepare for server start.
     */
    prepare() {
        return new Promise((resolve, reject) => {
            platform.locatePHP()
            .then(phpPath => {
                this.php = phpPath;
            })
            .then(platform.locatePocketMine.bind(this))
            .then(pharPath => {
                this.phar = pharPath;
            }).then(() => {
                return resolve();
            }).catch(err => {
                global.log.pmmp.error(err);
                process.exit(1);
            });
        });
    }

    /**
     * Starts the PocketMine server.
     */
    start() {
        if(this.pmmp != undefined && isRunning(this.pmmp.pid)) Promise.reject('Server is still running.');

        this.pmmp = spawn(this.php, [this.phar], {cwd: global.path + '/server'});
        this.pmmp.stdout.on('data', data => {
            global.log.pmmp.info(data.toString());
        });
        this.pmmp.stdout.on('end', data => {
            global.log.pmmp.info('PocketMine server was stopped.');
        });
        this.pmmp.on('exit', code => {
            global.log.pmmp.info('Exit code: ' + code);
            //global.log.warn('Is it still running? : ' + isRunning(this.pmmp.pid));
        });

        return new Promise((resolve, reject) => {
            let waited = 0;
            let timer = setInterval(() => {
                if(waited >= 10000) {
                    clearInterval(timer);
                    return reject('Timeout while waiting for server to start.');
                }
                if(isRunning(this.pmmp.pid)) {
                    clearInterval(timer);
                    return resolve();
                }
                waited += 500;
            }, 500);
        });
    }

    stop() {
        return new Promise((resolve, reject) => {
            if(!isRunning(this.pmmp.pid)) return resolve();

            this.pmmp.stdin.write('stop\n', 'utf-8');
            // Kill the server if it takes too long to stop.
            setTimeout((params) => {
                // TODO: This should probably use interval so it can finish more quickly.
                if(isRunning(this.pmmp.pid)) {
                    this.pmmp.kill('SIGKILL');
                    global.log.pmmp.warn('Killed PocketMine server because it took too long to shut down.');
                }
                return resolve();
            }, 10000);
        });
    }

    restart() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('Restarting...');
                
                this.stop().then(() => {
                    global.log.pmmp.error('ok now it should be stopped');
                    global.log.pmmp.error('is running: ' + isRunning(this.pmmp.pid));
                    return this.start();
                }).then(() => {
                    global.log.pmmp.error('The server should be running now...');
                    global.log.pmmp.error('Is running: ' + isRunning(this.pmmp.pid));
                    return resolve('Should be done now....');
                });
            }, 2000);
        });
    }

}

module.exports = Server;