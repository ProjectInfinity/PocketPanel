'use strict';

const ConsoleCommand = require('./ConsoleCommand');

class LinkCommand extends ConsoleCommand {
    
    constructor() {
        super();
        this.handle();
    }

    handle() {
        this.cli.command('link <email> <key>')
        .description('Links your wrapper to the web gui at PocketPanel.io')
        .on('--help', function() {
            console.log(`
            Go to https://pocketpanel.io/link and enter the private and public key shown.
            
            Example:
                ./console link email@example.com q58d83a96225679fh1954aa18825adc72edb7`
            );
        })
        .action((email, key) => {
            this.call({
                url: `http://127.0.0.1:${global.api_port}/link`,
                body: {
                    email: email,
                    key: key
                }
            }).then(response => {
                if(response.success) {
                    // TODO: Do something with the data received.
                } else if(!response.success) {
                    console.log(`\n${response.message}\nCause: ${response.code}`);
                    process.exit(1);
                }
            }).catch(err => {
                console.error(err);
                process.exit(1);
            });
        });
    }
}

module.exports = new LinkCommand;