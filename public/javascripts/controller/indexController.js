app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory)=> {
    $scope.messages = [ ];
    $scope.players = { };
    $scope.init = () =>{
        const userName = prompt('Kullanıcı Adı :');
        if(userName)
            initSocket(userName);
        else
        return false;

    };

    function initSocket(userName) {
        const connectionOptions = {
            reconnectionAttempts: 3,     
            reconnectionDelay: 600
        };
        indexFactory.connectSocket('http://localhost:3000', connectionOptions)
        .then((socket) => {
            socket.emit('newUser', { userName });

            socket.on('initPlayers', (players) => {
                $scope.players = players;
                $scope.$apply();
            });

            socket.on('newUser', (data) => {
                const messageData = {
                    type: {
                        code:0, // server or user message
                        message: 1 // login or disconnect message
                    }, // info
                    userName: data.userName,

                };

                $scope.messages.push(messageData);
                $scope.players[data.id] = data;
                $scope.$apply();
            });

            socket.on('disUser', (data) => {
                const messageData = {
                    type: {
                        code: 0, // server or user message
                        message: 0 // login or disconnect message
                    }, // info
                    userName: data.userName
                };

                $scope.messages.push(messageData);
                delete $scope.players[data.id];
                $scope.$apply();
            });

            socket.on('animate', data => {
                   $('#'+ data.socketId).animate({'left':  data.x, 'top': data.y }, () => {
                        animate = false;
                    });
            });

            let animate = false;
            $scope.onClickPlayer = ($event) =>{
                if(!animate){
                    let x = $event.offsetX;
                    let y = $event.offsetY;

                    socket.emit('animate',{ x, y });
                    $('#'+ socket.id).animate({'left':  x, 'top': y }, () => {
                        animate = false;
                    });
                }
                
            };




        }).catch((err) =>{
            console.log(err);
        });
    }   
   
}]);