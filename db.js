const pg = require('pg');
const url = require('url');


if( process.env.DATABASE_URL ){
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

  //we need to take apart the url so we can set the appropriate configs
  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');

  //make the configs object
  var configs = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
  };

}else {
    var configs = {
    user: 'clairetay',
    host: '127.0.0.1',
    database: 'salesdb',
    port: 5432
  };
}


const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

const allNeutralFunction = require('./models/neutral');
const NeutralModelsObject = allNeutralFunction( pool );

const allSellerFunction = require('./models/seller')
const SellerModelsObject = allSellerFunction(pool)

const allBuyerFunction = require('./models/buyer')
const BuyerModelsObject = allBuyerFunction(pool)

module.exports = {
  queryInterface: (text, params, callback) => {
    return pool.query(text, params, callback);
  },
  pool:pool,
  neutral: NeutralModelsObject,
  seller: SellerModelsObject,
  buyer: BuyerModelsObject
};