process.env.NODE_ENV = process.env.PARAM1 || process.env.NODE_ENV || 'development';
console.log('Environment set to '+process.env.NODE_ENV);

// Imports
var express     = require('express'),
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
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.cookieSession({
    secret: 'cult master omega destruction incantation',
    cookie: { maxAge: 1000*60*60 }
}));

app.use(express.static(__dirname + '/public'));

console.log('configuring');
app.configure('development', function(){ config.setDevConf(app); });
app.configure('production', function(){ config.setProdConf(app); });
app.configure('test', function(){ config.setTestConf(app); });
app.chat = [{user:'server', message:'welcome!'}];

console.log('routing');
// Routing setup



// Database / ORM setup



//app.games = new GameManager();


console.log('listening');
var server = require('http').createServer(app);
server.listen(app.get('port'), function(){ console.log('Listening to '+app.get('port')) });
var socket_listener = require('socket.io').listen(server, { log:true });
socket_listener.set("transports", ["xhr-polling", "jsonp-polling"]);
socket_listener.sockets.on('connection', ioRoutes);
app.sockets = socket_listener.sockets;

routes(app);
