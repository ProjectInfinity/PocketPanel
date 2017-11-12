'use strict';

const inquirer = require('inquirer');
const async = require('async');
const chalk = require('chalk');
const Promise = require('bluebird');

class Inquire {

    constructor(rootCaller) {
        global.log.pocketpanel.info('\nWelcome to the PocketPanel setup.\n');

        let answers = {};
        
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
                    answers.newServer = option.new_server;
                    callback();
                })
            },
            // 
            (callback) => {
                if(!answers.newServer) {
                    global.log.pocketpanel.info(chalk.yellow('To use your existing server move the files into the folder called "server" and run PocketPanel again.'));
                    return callback(null);
                }
                inquirer.prompt([
                    // LANGUAGE
                    {
                        type: 'list',
                        name: 'lang',
                        message: 'Select your language for PocketMine',
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
                    }
                ])
                .then((options) => {
                    answers.lang = options.language;
                    console.log(options);
                    return callback(new Error('Not fully implemented error.')); // TODO: Remove this once all questions are completed.
                });
            }
        ], (err) => {
            if(err) throw err;
            new (require(`./${global.os}/setup`))(answers, rootCaller);
        });
        
    }
}

module.exports = Inquire;