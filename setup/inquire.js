'use strict';

const inquirer = require('inquirer');
const async = require('async');
const chalk = require('chalk');
const Promise = require('bluebird');
const fs = require('fs-extra');
const ini = require('ini');

class Inquire {

    constructor(rootCaller) {
        global.log.pocketpanel.info('\nWelcome to the PocketPanel setup.\n');

        let newServer = false;
        
        async.waterfall([
            (callback) => {
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'new_server',
                        message: 'Do you want to set up a new server?',
                        default: true,
                        choices: [
                            {name: 'Yes', value: true},
                            {name: 'No I have a server I want to use', value: false}
                        ]
                    }
                ]).then((option) => {
                    newServer = option.new_server;
                    callback();
                })
            },
            // 
            (callback) => {
                if(!newServer) {
                    global.log.pocketpanel.info(chalk.yellow('To use your existing server move the files into the folder called "server" and run PocketPanel again.'));
                    return callback(null);
                }
                inquirer.prompt([
                    // LANGUAGE
                    {
                        type: 'list',
                        name: 'lang',
                        message: 'Select your language for PocketMine (ONLY ENGLISH AT THE MOMENT)',
                        default: 'eng',
                        choices: [
                            {name: 'العربية', value: 'ara'},
                            {name: 'Čeština', value: 'ces'},
                            {name: '中文 (简体)', value: 'chs'},
                            {name: 'Deutsch', value: 'deu'},
                            {name: 'Ελληνικά', value: 'ell'},
                            {name: 'English', value: 'eng'},
                            {name: 'Eesti', value: 'est'},
                            {name: 'Suomi', value: 'fin'},
                            {name: 'Français', value: 'fra'},
                            {name: 'Gaeilge', value: 'gle'},
                            {name: 'עברית', value: 'heb'},
                            {name: 'Magyar', value: 'hun'},
                            {name: 'Bahasa Indonesia', value: 'ind'},
                            {name: 'Italiano', value: 'ita'},
                            {name: '日本語', value: 'jpn'},
                            {name: '한국어', value: 'kor'},
                            {name: 'Latviešu', value: 'lav'},
                            {name: 'Malti', value: 'mlt'},
                            {name: 'Bahasa Melayu', value: 'msa'},
                            {name: 'Nederlands', value: 'nld'},
                            {name: 'Norsk', value: 'nor'},
                            {name: 'Polski', value: 'pol'},
                            {name: 'Português', value: 'por'},
                            {name: 'Pyccĸий', value: 'rus'},
                            {name: 'Español', value: 'spa'},
                            {name: 'Svenska', value: 'swe'},
                            {name: 'Tagalog', value: 'tgl'},
                            {name: 'ภาษาอังกฤษ', value: 'tha'},
                            {name: 'tlhIngan', value: 'tlh'},
                            {name: 'Türkçe', value: 'tur'},
                            {name: 'Українська', value: 'ukr'},
                            {name: 'Tiếng Việt', value: 'vie'},
                            {name: '中文(繁體)', value: 'zho'},
                        ]
                    },
                    // MOTD
                    {
                        type: 'input',
                        name: 'motd',
                        message: 'Enter your message of the day (motd)',
                        default: 'PocketMine-MP Server',
                    },
                    // PORT
                    {
                        type: 'input',
                        name: 'port',
                        message: 'Enter the port you want your server to run on',
                        default: 19132,
                        validate: function(input) {
                            return new Promise((resolve, reject) => {
                                if(/^\+?(0|[1-9]\d*)$/.test(input) && Number(input) > 0) return resolve(true);
                                return reject('Your server port has to be a number');
                            });
                        }
                    },
                    // WHITELIST
                    {
                        type: 'confirm',
                        name: 'whitelist',
                        message: 'Should your server be whitelisted?',
                        default: false
                    },
                    // MAX PLAYERS
                    {
                        type: 'input',
                        name: 'max_players',
                        message: 'Set the max number of players on your server',
                        default: 20,
                        validate: function(input) {
                            return new Promise((resolve, reject) => {
                                if(/^\+?(0|[1-9]\d*)$/.test(input) && Number(input) > 0) return resolve(true);
                                return reject('Player slots have to be a number');
                            });
                        }
                    },
                    // ALLOW FLYING
                    {
                        type: 'confirm',
                        name: 'allow_flying',
                        message: 'Allow flying? Not recommended',
                        default: false
                    },
                    // GAMEMODE
                    {
                        type: 'list',
                        name: 'gamemode',
                        message: 'Select game mode',
                        default: 0,
                        choices: [
                            {name: 'Survival', value: 0},
                            {name: 'Creative', value: 1},
                            {name: 'Adventure', value: 2},
                            {name: 'Spectator', value: 3}
                        ]
                    },
                    // PVP
                    {
                        type: 'confirm',
                        name: 'pvp',
                        message: 'Enable Player Versus Player (PvP) combat?',
                        default: false
                    },
                    // DIFFICULTY
                    {
                        type: 'list',
                        name: 'difficulty',
                        message: 'Choose a difficulty',
                        default: 1,
                        choices: [
                            {name: 'Peaceful', value: 0},
                            {name: 'Easy', value: 1},
                            {name: 'Normal', value: 2},
                            {name: 'Hard', value: 3}
                        ]
                    },
                    // LEVEL-NAME
                    {
                        type: 'input',
                        name: 'level_name',
                        message: 'Name your world',
                        default: 'world'
                    },
                    // LEVEL-TYPE
                    {
                        type: 'list',
                        name: 'level_type',
                        message: 'Choose the type of your world',
                        default: 'DEFAULT',
                        choices: [
                            {name: 'Default', value: 'DEFAULT'},
                            {name: 'Flat', value: 'FLAT'}
                        ]
                    } 
                ])
                .then((options) => {
                    return callback(null, options);
                });
            }
        ], (err, options) => {
            if(err) throw err;
            if(newServer) {
                this.createServerDirectory()
                    .then(() => this.saveIni(options))
                    .then(() => new (require(`./${global.os}/setup`))(rootCaller))
                    .catch(err => {
                        global.log.pocketpanel.error(err);
                        process.exit(1);
                    });
            }
        });
        
    }

    createServerDirectory() {
        return new Promise((resolve, reject) => {
            if(!fs.existsSync(`${global.path}/server`)) {
                global.log.pocketpanel.info('Server directory missing, creating it.');
                fs.mkdirSync(`${global.path}/server`);
                return resolve();
            } else {
                return reject('Uh oh! The server directory already exists! Delete it to re-run the server setup.');
            }
        });
    }

    saveIni(options) {
        return new Promise((resolve, reject) => {
            let props = {
                motd: options.motd,
                'server-port': Number(options.port),
                'white-list': options.whitelist ? 'on' : 'off',
                'announce-player-achievements': 'on',
                'spawn-protection': 16,
                'max-players': options.max_players,
                'allow-flight': options.allow_flying ? 'on' : 'off',
                'spawn-animals': 'on',
                'spawn-mobs': 'on',
                gamemode: options.gamemode,
                'force-gamemode': 'off',
                hardcore: 'off',
                pvp: options.pvp ? 'on' : 'off',
                difficulty: options.difficulty,
                'generator-settings': '',
                'level-name': options.level_name,
                'level-seed': '',
                'level-type': options.level_type,
                'enable-query': 'on',
                'enable-rcon': 'off',
                'rcon.password': 'BpaM' + Date.now() + 'Gm3k1z',
                'auto-save': 'on',
                'view-distance': 8,
                'xbox-auth': 'on'
            };

            fs.writeFileSync(`${global.path}/server/server.properties`, '#Properties Config File Generated By PocketPanel\n#' + new Date() + '\n' + ini.stringify(props));

            global.log.pocketpanel.info('Generated server.properties based on your choices.');

            return resolve();
        });
    }
}

module.exports = Inquire;