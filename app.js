// Primary server entry point

// server setup

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

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

connections = [];

server.lastPlayerID = 0;

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log("new connection %s, total: %s", socket.id, connections.length);

    socket.on('disconnect', function(data) {
        connections.splice(connections.indexOf(socket), 1);
        console.log("disconnect %s, total %s", socket.id, connections.length);
    });

    socket.on('newPlayer', function(player) {
        socket.player = {
            id: server.lastPlayerID++,
            x: randomInt(0, 200),
            y: randomInt(0, 200)
        }
        socket.emit('allPlayers', getAllPlayers());
        socket.broadcast.emit('newPlayer', socket.player);

        socket.on('keyMove', function(data) {
            socket.player.x += data.x;
            socket.player.y += data.y;
            io.emit('move', socket.player);
        });

        socket.on('disconnect', function() {
            io.emit('remove', socket.player.id);
        });
    });
});

function getAllPlayers() {
    var players = [];
    Object.keys(io.sockets.connected).forEach(function(socketID) {
        var player = io.sockets.connected[socketID].player;
        if (player)
            players.push(player);
    });
    return players;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}








