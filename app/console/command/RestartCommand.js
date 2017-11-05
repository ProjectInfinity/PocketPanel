'use strict';

const ConsoleCommand = require('./ConsoleCommand');

class RestartCommand extends ConsoleCommand {

    constructor() {
        super();
        this.handle();
    }

    handle() {
        this.cli.command('restart')
        .description('Restarts your server, optionally within the specified amount of minutes.')
        .on('--help', function() {
            console.log(`
            Restarts your server. If a second parameter is specified PocketPanel will treat it as the number of minutes until the server should restart.
            
            Example:
                ./console restart 5
            `);
        })
        .option('-m', '--minutes <n>', 'Amount in minutes', Number)
        .action(minutes => {
            //console.log('minutes: ' + minutes);
            let hasTimer = typeof minutes !== 'object';
            if(hasTimer) minutes = Math.floor(Number(minutes));

            if((hasTimer && isNaN(minutes)) || (hasTimer && minutes < 1)) {
                console.log('\nError! Minutes can only be specified in whole numbers and must be at least 1.');
                return;
            }
            // TODO: setInterval instead, we need to show some sort of progression.
            let time = 0;
            let timer = setInterval(() => {
                if(time >= (hasTimer ? minutes * 60000 : 0)) {
                    clearInterval(timer);
                    console.log('Restarting server. This may take a while...');
                    return this.restartServer();
                }
                console.log('Time until restart in seconds: ' + (((minutes * 60000) - time) / 1000));
                time += 500;
            }, 500);
        });
    }

    restartServer() {
        this.send('/server/restart').catch(err => {
            console.error(err);
            process.exit(1);
        });
    }
}

module.exports = new RestartCommand;