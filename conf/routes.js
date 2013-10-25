

var controllers = require('../lib/controllers'),
    uuid = require('node-uuid'),
    sockets,
    chat;


module.exports.router = function(app) {
    chat = app.chat;
    sockets = app.sockets;

    app.get('/', function(req, res) { res.render('index'); });
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
        var msg_obj = {message:msg, user:client.nick}
        chat.push(JSON.stringify(msg_obj));
        client.broadcast.emit('get:message', msg_obj);
    });
    
    client.on('get:messages', function() {
        client.emit('get:messages', JSON.stringify(chat));
    });
    
    
    
    client.on('disconnect', function () { 
        chat.push('Client '+client.nick+' disconnected'); 
    });

};




