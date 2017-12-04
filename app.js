// Primary server entry point

// server setup

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var Player = require('./js/Player');

// path handling

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/scripts', express.static(__dirname + '/node_modules/phaser/build'))

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

server.listen(process.env.PORT || 3000, function() {
    console.log("Server started on port " + server.address().port);
});

// connections

var connections = [];
var players = [];

server.lastPlayerID = 0;

io.sockets.on('connection', onSocketConnection);

function onSocketConnection(client) {
    connections.push(client.id);
    console.log("New connection %s, total: %s", client.id, connections.length);

    client.on('disconnect', onClientDisconnect);
    client.on('new player', onNewPlayer);
    client.on('move player', onMovePlayer);
}

function onClientDisconnect() {
    console.log("Disconnect %s, total: %s", this.id, connections.length);

    var removePlayer = playerById(this.id);
    players.splice(players.indexOf(removePlayer), 1);

    this.broadcast.emit('remove player', {id: this.id});
}

function onNewPlayer(data) {
    var newPlayer = new Player(data.x, data.y);
    newPlayer.id = this.id;

    this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

    for (var i = 0; i < players.length; i++) {
        var existingPlayer = players[i];
        this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    }

    players.push(newPlayer);
}

function onMovePlayer(data) {
    var movePlayer = playerById(this.id);

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
}

function playerById(id) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id === id)
            return players[i];
    }
    return false;
}














