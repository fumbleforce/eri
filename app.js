process.env.NODE_ENV = process.env.PARAM1 || process.env.NODE_ENV || 'development';
console.log('Environment set to '+process.env.NODE_ENV);

// Imports
var express     = require('express'),
    bodyParser  = require('body-parser'),
    _           = require('underscore'),
    routes      = require('./conf/routes').router,
    ioRoutes    = require('./conf/routes').ioRouter,
    config      = require('./conf/conf');

var app = express();

// Express Settings

app.set('views', __dirname + '/lib/views');
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.engine('.jade', require('jade').__express);

// parse application/json
app.use(bodyParser.json());

// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));


app.use(express.static(__dirname + '/public'));

console.log('routing');
// Routing setup



// Database / ORM setup



//app.games = new GameManager();


console.log('listening');
var server = require('http').createServer(app);
server.listen(app.get('port'), function(){ console.log('Listening to '+app.get('port')); });
var socket_listener = require('socket.io').listen(server, { log:true });
socket_listener.set("transports", ["xhr-polling", "jsonp-polling"]);
socket_listener.sockets.on('connection', ioRoutes);
app.sockets = socket_listener.sockets;

routes(app);
