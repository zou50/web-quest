var Game = {};
var timer;
Game.create = function() {
    socket = io.connect();

	timer = game.time.create(false);
	
    // initialize tiled map
    map = game.add.tilemap('map1', 16, 16);
    map.addTilesetImage('tiles', 'gameTiles');

    // create tiled map layers
    backgroundLayer = map.createLayer(0);
    foregroundLayer = map.createLayer(1);
    blockedLayer = map.createLayer(2);
    backgroundLayer.resizeWorld();

    map.setCollisionBetween(1, 2000, true, 'blockedLayer');

    // camera settings
    game.camera.setSize(400, 320);

    // other players
    players = [];

    // input
    cursors = game.input.keyboard.createCursorKeys();
	keys = game.input.keyboard.addKeys({'action': Phaser.KeyCode.Z, 'cancel': Phaser.KeyCode.X, 'item': Phaser.KeyCode.A})
	
	//On attack press
	keys.action.onDown.add(attack,this);
	//keys.action.onUp.add(stopAtk,this);	
 	
    // player
    player = game.add.sprite(randomInt(0, 200), randomInt(0, 200), 'characters', sprites["white"]);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.bounce.setTo(1, 1);
    game.camera.follow(player);

    weapon = game.add.sprite(player.x + 11, player.y, 'characters', sprites["battleaxe"]);

    // Client.newPlayer(player.body);
    setEventHandlers();
	timer.start();

}

var setEventHandlers = function() {
    // Socket connection successful
    socket.on('connect', Game.onSocketConnected)

    // Socket disconnection
    socket.on('disconnect', Game.onSocketDisconnect)

    // New player message received
    socket.on('new player', Game.onNewPlayer)

    // Player move message received
    socket.on('move player', Game.onMovePlayer)

    // Player removed message received
    socket.on('remove player', Game.onRemovePlayer)
}

Game.update = function() {
    game.physics.arcade.collide(player, blockedLayer);
    for (var i = 0; i < players.length; i++) {
        if (players[i].alive) {
            players[i].update();
            game.physics.arcade.collide(player, players[i].player);
        }
    }

    weapon.x = player.x + 11;
    weapon.y = player.y;

    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    playerSpeed = 65;

    if (cursors.up.isDown)
        player.body.velocity.y -= playerSpeed;
    else if (cursors.down.isDown)
        player.body.velocity.y += playerSpeed;
    if (cursors.left.isDown)
        player.body.velocity.x -= playerSpeed;
    else if (cursors.right.isDown)
        player.body.velocity.x += playerSpeed;

    socket.emit('move player', { x: player.x, y: player.y });
}

Game.render = function() {
    // game.debug.cameraInfo(game.camera, 32, 32);
}

Game.onSocketConnected = function() {
    console.log("Connected");

    socket.emit('new player', { x: player.x, y: player.y });
}

Game.onSocketDisconnected = function() {
    console.log("Disconnected");
}

Game.onNewPlayer = function(data) {
    console.log("New player");

    players.push(new RemotePlayer(data.id, game, player, data.x, data.y));
}

Game.onMovePlayer = function(data) {
    console.log("move");
    var movePlayer = playerById(data.id);
    movePlayer.player.x = data.x;
    movePlayer.player.y = data.y;
}

Game.onRemovePlayer = function(data) {
    var removed = playerById(data.id);

    removed.player.kill();

    players.splice(players.indexOf(removed), 1);
}

function attack() {
    slashfx = game.add.sprite(player.x+15,player.y,'slash');
	timer.add(125,stopAtk,this);
}

function stopAtk() {
    slashfx.kill();
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function playerById(id) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].player.name === id)
            return players[i];
    }
    return false;
}






