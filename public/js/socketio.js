var socket = io.connect("/");

socket.on('connected', function () {
    console.log('connected');
    socket.emit('get:messages');
});

socket.on('error', function (e) {
    console.log(e);
});
