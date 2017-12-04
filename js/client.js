var Client = {};

Client.socket = io.connect();

Client.askNewPlayer = function() {
    Client.socket.emit('newPlayer');
}

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
    Game.movePlayer(player.id, player.cursors);
})

Client.handleMove = function(cursors) {
    Client.socket.emit('keyMove', cursors);
}