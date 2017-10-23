'use strict';

const axios = require('axios');

class Routes {

    constructor(server, restify) {
        this.server = server;

        /*this.server.pre((req, res, next) => {
            return next();
        });*/

        this.server.use(restify.plugins.bodyParser({ mapParams: true }));
        this.server.use(restify.plugins.queryParser({ mapParams: true }));

        /*this.server.on('after', (req, res, route, err) => {
            if(err) throw err;
        });*/
        
        this.server.post('/link', this._validate.bind(this), (req, res, next) => {
            axios({
                method: 'POST',
                url: `${process.env.POCKETPANEL_BACKEND}/link`,
                data: {
                    email: req.params.email,
                    key: req.params.key
                },
                headers: {'User-Agent': 'PocketPanel CLI'}
            }).then(response => {
                res.send(response.data);
                return next();
            });
        });
    }

    _validate(req, res, next) {
        if(req.header('X-API-Auth', undefined) !== global.api_token) return res.send(403)
        return next();
    }

}

module.exports = Routes;