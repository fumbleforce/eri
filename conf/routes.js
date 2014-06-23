

var controllers = require('../lib/controllers'),
    uuid = require('node-uuid'),
    sockets;


module.exports.router = function(app) {
    sockets = app.sockets;


    app.get('/', function(req, res) { res.render('index'); });

    app.get('/lydighet', function(req, res) { res.render('lydighet'); });
};

module.exports.ioRouter = function(client) {


    client.userid = uuid.v4();
    client.nick = 'Anon';
    console.log("Set client ID to " + client.userid);
    client.emit('connected');

    client.on('set:nick', function(data) {
        client.nick = data;
        client.broadcast.emit('get:message', JSON.stringify({user: 'server', message: data+' has connected.'}));
    });
    
    client.on('send:message', function(msg) {
        var msg_obj = { message:msg, user:client.nick };
        client.broadcast.emit('get:message', msg_obj);
    });
    
    client.on('get:messages', function() {
        var loggedUsers = 'The following users are in the chatroom: ';
        for (var i=0;i<sockets.length;i++) {
            loggedUsers = loggedUsers + sockets[i].nick + ', ';
        }
        client.emit('get:messages',
            JSON.stringify([
                {
                    user:'server',
                    message:'welcome!'
                },
                {
                    user:'server',
                    message:loggedUsers
                }]));
    });
    
    client.on('disconnect', function () {
        client.broadcast.emit('get:message',
            JSON.stringify({
                user:'server',
                message:'Client '+client.nick+' disconnected'
            }));
    });

};




