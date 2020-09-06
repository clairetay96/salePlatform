const express = require('express');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const path = require('path')


const app = express()

// Set up middleware
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);


const allModels = require('./db');
const setRoutesFunction = require('./routes');

setRoutesFunction(app, allModels);

const server = app.listen(3000, () => console.log('~~~ Tuning in to the waves of port 3000~~~'));


let onClose = function(){
  server.close(() => {
    console.log('Process terminated')
    allModels.pool.end( () => console.log('Shut down db connection pool'));
  })
};

process.on('SIGTERM', onClose);
process.on('SIGINT', onClose);