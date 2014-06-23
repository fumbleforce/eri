var chatApp = angular.module('chat', [])

.controller('chatroom', function($scope) {

    $scope.messages = [{user:'None', message:'No messages received'}];
    $scope.nick_set = false;

    socket.on('get:messages', function(msgs) {
        if (typeof msgs === 'string') { msgs = JSON.parse(msgs); }
        if( Object.prototype.toString.call( msgs ) === '[object Array]' ) { msgs = [msgs]; }
        $scope.messages = msgs;
        $scope.$apply();
    });
    
    socket.on('get:message', function(msg) {
        if (typeof msg === String || typeof msg === 'string') { msg = JSON.parse(msg); }
        $scope.messages.push(msg);
        $scope.$apply();
    });
    
    
    
    $scope.sendMessage = function() {
    
        if($scope.message === '') return;
    
        socket.emit('send:message', $scope.message);
        
        $scope.messages.push({
            user: $scope.nick,
            message: $scope.message
        });
        $scope.message = '';
    }
    
    $scope.unsetNick = function() {
        $scope.nick_set = false;
    };
    
    $scope.setNick = function() {
        socket.emit('set:nick', $scope.nicktemp)
        $scope.nick = String($scope.nicktemp);
        $scope.nicktemp = '';
        $scope.nick_set = true;
    }
    
})



.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
})





































