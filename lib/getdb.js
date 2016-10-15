const getDb   = require('mongo-getdb');
const config  = require('../app.config');

const options = {};

getDb.init(config.MONGO_URL, {});

module.exports = getDb;