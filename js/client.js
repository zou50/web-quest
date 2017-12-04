var Client = {};

Client.socket = io.connect();

// Listen
Client.socket.on('newPlayer', function(data) {
    Game.addNewPlayer(data.id, data.x, data.y);
});

Client.socket.on('remove', function(id) {
    Game.removePlayer(id);
})

Client.socket.on('allPlayers', function(data) {
    for (var i = 0; i < data.length; i++) {
        Game.addNewPlayer(data[i].id, data[i].x, data[i].y);
    }
});

Client.socket.on('move', function(player) {
    Game.movePlayer(player.id, player.x, player.y);
});

// Functions
Client.askNewPlayer = function() {
    Client.socket.emit('newPlayer');
}

Client.handleMove = function(x, y) {
    // console.log("move");
    Client.socket.emit('keyMove', {x: x, y: y});
}