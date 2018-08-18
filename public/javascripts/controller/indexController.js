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
                $scope.$apply();
            });

            let animate = false;
            $scope.onClickPlayer = ($event) =>{
                if(!animate){
                    $('#'+ socket.id).animate({'left':  $event.offsetX, 'top': $event.offsetY }, () => {
                        animate = false;
                    });
                }
                
            };




        }).catch((err) =>{
            console.log(err);
        });
    }   
   
}]);