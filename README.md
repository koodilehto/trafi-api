[![build status](https://secure.travis-ci.org/bebraw/trafi-api.png)](http://travis-ci.org/bebraw/trafi-api)
# trafi-api

API for [trafi vehicle dataset](http://www.trafi.fi/palvelut/avoin_data).

## Usage

1. Download CSV from Trafi and point the API by copying `config/config.template.js` as `config./config.js` and tweaking `registrationPath`. It looks into project root by default.
2. `npm install` - Install dependencies
3. `./load_data.js` - Load initial data to db (MongoDB).
3. `npm start` - Run server
4. Navigate to `http://localhost:8000/v1/`. That will show the resources available. Pick one and append it to the URL.

Possible queries have been listed at [rest-sugar](https://github.com/sugarjs/rest-sugar). Only `GET` is allowed and maximum amount of items per page has been restricted in configuration. Use pagination to access all items.

Note that the current system loads the whole dataset to memory on start! It would be possible to rearchitect this to use some real database if needed.

If you use the API, remember to include attribution for Trafi as instructed at [the licensing terms](http://www.trafi.fi/palvelut/avoin_data/avoimen_datan_lisenssi).

## License

`trafi-api` is available under MIT. See LICENSE for more details.

