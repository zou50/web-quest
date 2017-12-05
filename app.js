// Primary server entry point

// server setup

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var ServerPlayer = require('./js/ServerPlayer');
var ServerMob = require('./js/ServerMob');
var ServerItem = require('./js/ServerItem');

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
var items = [];

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
    client.on('remove mob', onRemoveMob);
    client.on('remove all mobs', onRemoveAllMobs);
    client.on('new item', onNewItem);
    client.on('remove item', onRemoveItem);
    client.on('remove all items', onRemoveAllItems);
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
        this.emit('new mob', {id: existingMob.id, t: existingMob.type, x: existingMob.getX(), y: existingMob.getY()});
    }
    // send server items to self
    for (var i = 0; i < items.length; i++) {
        var existingItem = items[i];
        this.emit('new item', {id: existingItem.id, x: existingItem.getX(), y: existingItem.getY()});
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
    var newMob = new ServerMob(data.t, data.x, data.y);
    newMob.id = mobs.length + "";

    // send new mob to all clients
    io.sockets.emit('new mob', {id: newMob.id, t: data.t, x: newMob.getX(), y: newMob.getY()});

    mobs.push(newMob);
}

function onMoveMob(data) {
    var moveMob = mobById(data.id);

    if (!moveMob)
        return;

    moveMob.setX(data.x);
    moveMob.setY(data.y);

    this.broadcast.emit('move mob', {id: data.id, x: moveMob.getX(), y: moveMob.getY()});
}

function onRemoveMob(data) {
    var removeMob = mobById(data.id);

    if (!removeMob)
        return;

    io.sockets.emit('remove mob', {id: removeMob.id});

    mobs.splice(mobs.indexOf(removeMob), 1);
}

function onRemoveAllMobs() {
    io.sockets.emit('remove all mobs');
    mobs = [];
}

/* ITEMS */

function onNewItem(data) {
    var newItem = new ServerItem(data.x, data.y);
    newItem.id = items.length + "";

    if (!newItem)
        return;

    io.sockets.emit('new item', {id: newItem.id, x: newItem.getX(), y: newItem.getY()});

    items.push(newItem);
}

function onRemoveItem(data) {
    var removeItem = itemById(item.id);

    if (!removeItem)
        return;

    this.broadcast.emit('remove item', {id: removeItem.id});

    items.splice(items.indexOf(removeItem), 1);
}

function onRemoveAllItems() {
    io.sockets.emit('remove all items');
    items = [];
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

function itemById(id) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].id === id)
            return items[i];
    }
    return false;
}














