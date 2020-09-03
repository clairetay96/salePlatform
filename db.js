const pg = require('pg');
const url = require('url');

const configs = {
    user: 'clairetay',
    host: '127.0.0.1',
    database: 'salesdb',
    port: 5432
  };


const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

const allNeutralFunction = require('./models/neutral');
const NeutralModelsObject = allNeutralFunction( pool );

module.exports = {
  queryInterface: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  pool:pool,
  neutral: NeutralModelsObject
};