'use strict';

const inquirer = require('inquirer');
const async = require('async');
const chalk = require('chalk');

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
                    {
                        type: 'list',
                        name: 'language',
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
                    }
                ])
                .then((option) => {
                    answers.language = option.language;
                    return callback(null);
                });
                /*inquirer.prompt([
                    {
                        type: 'input'
                    }
                ]); */
            }
        ], (err) => {
            if(err) throw err;
            new (require(`./${global.os}/setup`))(answers, rootCaller);
        });
        
    }
}

module.exports = Inquire;