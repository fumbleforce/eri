var chatApp = angular.module('chat', [])

.controller('chatroom', function($scope) {

    $scope.messages = [{user:'None', message:'No messages received'}];
    $scope.nick_set = false;

    socket.on('get:messages', function(msgs) {
        console.log('got messages');
        console.log(msgs);
        console.log(typeof msgs);
        if (typeof msgs === String || typeof msgs === 'string') { console.log('parsing'); msgs = JSON.parse(msgs); }
        $scope.messages = msgs;
        console.log($scope.messages);
        $scope.$apply();
    });
    
    socket.on('get:message', function(msg) {
        console.log('got one message');
        console.log(msg);
        if (typeof msg === String || typeof msg === 'string') { console.log('parsing'); msg = JSON.parse(msg); }
        $scope.messages.push(msg);
        $scope.$apply();
    });
    
    
    
    $scope.sendMessage = function() {
        socket.emit('send:message', $scope.message);
        
        $scope.messages.push({
            user: $scope.nick,
            message: $scope.message
        });
        $scope.message = '';
    }
    
    
    
    $scope.setNick = function() {
        socket.emit('set:nick', $scope.nicktemp)
        console.log('Setting nick to '+$scope.nicktemp);
        $scope.nick = String($scope.nicktemp);
        $scope.nicktemp = '';
        $scope.nick_set = true;
    }
    
})









































