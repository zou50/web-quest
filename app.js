// Primary server entry point

// server setup

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var ServerPlayer = require('./js/ServerPlayer');
var ServerMob = require('./js/ServerMob');

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

// objects
var players = [];
var mobs = [];

io.sockets.on('connection', onSocketConnection);

/* CONNECTIONS */

function onSocketConnection(client) {
    connections.push(client.id);
    console.log("New connection %s, total: %s", client.id, connections.length);

    client.on('disconnect', onClientDisconnect);
    client.on('new player', onNewPlayer);
    client.on('move player', onMovePlayer);
    client.on('new mob', onNewMob);
    client.on('move mob', onMoveMob);
    client.on('remove all mobs', onRemoveAllMobs);
}

function onClientDisconnect() {
    connections.splice(connections.indexOf(this.id), 1);
    console.log("Disconnect %s, total: %s", this.id, connections.length);

    var removePlayer = playerById(this.id);

    if (!removePlayer)
        return;

    players.splice(players.indexOf(removePlayer), 1);

    this.broadcast.emit('remove player', {id: this.id});
}

/* PLAYERS */

function onNewPlayer(data) {
    var newPlayer = new ServerPlayer(data.x, data.y);
    newPlayer.id = this.id;

    // notify others of self
    this.broadcast.emit('new player', {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});

    // send other players to self
    for (var i = 0; i < players.length; i++) {
        var existingPlayer = players[i];
        this.emit('new player', {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
    }
    // send server mobs to self
    for (var i = 0; i < mobs.length; i++) {
        var existingMob = mobs[i];
        this.emit('new mob', {id: existingMob.id, x: existingMob.getX(), y: existingMob.getY()});
    }

    players.push(newPlayer);
}

function onMovePlayer(data) {
    var movePlayer = playerById(this.id);

    if (!movePlayer)
        return;

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    this.broadcast.emit('move player', {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
}

/* MOBS */

function onNewMob(data) {
    var newMob = new ServerMob(data.x, data.y);
    newMob.id = mobs.length + "";

    // send new mob to all clients
    io.sockets.emit('new mob', {id: newMob.id, x: newMob.getX(), y: newMob.getY()});

    mobs.push(newMob);
}

function onMoveMob(data) {
    var moveMob = mobById(data.id);

    if (!moveMob)
        return;

    moveMob.setX(data.x);
    moveMob.setY(data.y);

    // send new mob data to other clients
    this.broadcast.emit('move mob', {id: data.id, x: moveMob.getX(), y: moveMob.getY()});
}

function onRemoveAllMobs() {
    io.sockets.emit('remove all mobs');
    mobs = [];
}

/* HELPER FUNCTIONS */

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function playerById(id) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id === id)
            return players[i];
    }
    return false;
}

function mobById(id) {
    for (var i = 0; i < mobs.length; i++) {
        if (mobs[i].id === id)
            return mobs[i];
    }
    return false;
}














