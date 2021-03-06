(function(){
    // this is a factory that handles the socket events
    // it is necessary to run the digest function on
    // incoming data
    app.factory('socket', function ($rootScope) {
        var socket = io.connect();
        // returns a object that will have the ability to
        // send and recieve data on the socket
        return {
            on: function (eventName, callback) {
                // if there is already a listener, remove it
                console.log(socket._callbacks[eventName], eventName) 
                if(socket._callbacks[eventName] && eventName != "profileInfo"){;
                    delete socket._callbacks[eventName];
                }
                socket.on(eventName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    });
})()
