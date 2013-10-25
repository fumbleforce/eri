var socket = io.connect("http://127.0.0.1/");

socket.on('connected', function () {
    console.log('connected');
    socket.emit('get:messages');
});

socket.on('error', function (e) {
    console.log(e);
});
