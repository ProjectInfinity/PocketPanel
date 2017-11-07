'use strict';

const util = require('util')
const fs = require('fs-extra');
const os = require('os');

global.path = __dirname;
global.log = {pocketpanel: require('logging').default('PocketPanel')};

global.log.pocketpanel.info('PocketPanel is starting up...');

global.isDev = fs.existsSync(`${global.path}/.develop`);

switch(process.platform.toString().toUpperCase()) {
    case 'DARWIN':
        global.os = 'mac';
    break;

    case 'OPENBSD':
    case 'FREEBSD':
        global.os = 'bsd';
    break;

    case 'LINUX':
        global.os = 'linux';
    break;

    case 'WIN32':
        global.os = 'windows';
    break;

    default:
        global.log.error('Unsupported operating system detected.');
        process.exit(1);
}

if(global.os !== undefined) {
    global.log.pocketpanel.info(`OS detected: ${global.os}`);
}

// Create internal data folder if it does not exist.
if(!fs.existsSync(`${global.path}/.pocketpanel`)) fs.mkdirSync(`${global.path}/.pocketpanel`);

const configManager = new (require('./app/config/ConfigManager'));

configManager.wait().then(config => {
    global.config = config;
    new (require('./pocketpanel'))();
});
