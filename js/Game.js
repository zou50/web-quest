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

    // baddies
    mobs = [];

    // input
    cursors = game.input.keyboard.createCursorKeys();
	keys = game.input.keyboard.addKeys({
        'action': Phaser.KeyCode.Z,
        'cancel': Phaser.KeyCode.X,
        'item': Phaser.KeyCode.A,
        // admin
        'spawnZ': Phaser.KeyCode.Q,
        'removeAllZ': Phaser.KeyCode.W
    });
    keys.spawnZ.onDown.add(() => {
        socket.emit('new mob', {x: randomInt(0, 200), y: randomInt(0, 200)});
    });
    keys.removeAllZ.onDown.add(() => {
        socket.emit('remove all mobs');
    });
	
	//On attack press
	keys.action.onDown.add(attack,this);
	//keys.action.onUp.add(stopAtk,this);
 	
    // client player
    player = game.add.sprite(randomInt(0, 200), randomInt(0, 200), 'characters', sprites["white"]);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.bounce.setTo(1, 1);
    player.anchor.setTo(0.5, 0.5);

    game.camera.follow(player);

    weapon = game.add.sprite(player.x + 11, player.y, 'characters', sprites["battleaxe"]);
    weapon.anchor.setTo(0.5, 0.5);

    setEventHandlers();
	timer.start();
}

var setEventHandlers = function() {
    // Socket connection successful
    socket.on('connect', Game.onSocketConnected);

    // Socket disconnection
    socket.on('disconnect', Game.onSocketDisconnect);

    // New player message received
    socket.on('new player', Game.onNewPlayer);

    // Player move message received
    socket.on('move player', Game.onMovePlayer);

    // Player removed message received
    socket.on('remove player', Game.onRemovePlayer);

    // New mob message received
    socket.on('new mob', Game.onNewMob);

    // Move mob message received
    socket.on('move mob', Game.onMoveMob);

    // Remove mob message received
    socket.on('remove mob', Game.onRemoveMob);

    // Remove all mobs message received
    socket.on('remove all mobs', Game.onRemoveAllMobs);
}

Game.update = function() {
    game.physics.arcade.collide(player, blockedLayer);
    for (var i = 0; i < players.length; i++) {
        if (players[i].sprite.alive) {
            players[i].update();
            game.physics.arcade.collide(player, players[i].sprite);
        }
    }
    for (var i = 0; i < mobs.length; i++) {
        if (mobs[i].sprite.alive) {
            mobs[i].update();
            game.physics.arcade.collide(mobs[i].sprite, blockedLayer);
            if (mobs[i].target) {
                socket.emit('move mob', {id: mobs[i].sprite.name, x: mobs[i].sprite.x, y: mobs[i].sprite.y});
            }
        }
    }

    weapon.x = player.x + 11;
    weapon.y = player.y;

    playerSpeed = 65;
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

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

function attack() {
    slashfx = game.add.sprite(player.x+15,player.y,'slash');
    slashfx.anchor.setTo(0.5, 0.5);
    timer.add(125,stopAtk,this);
}

function stopAtk() {
    slashfx.kill();
}

/* CONNECTIONS */

Game.onSocketConnected = function() {
    console.log("Connected");

    socket.emit('new player', { x: player.x, y: player.y });
}

Game.onSocketDisconnected = function() {
    console.log("Disconnected");
}

/* PLAYERS */

Game.onNewPlayer = function(data) {
    console.log("New player");

    players.push(new RemotePlayer(data.id, game, player, data.x, data.y));
}

Game.onMovePlayer = function(data) {
    var movePlayer = playerById(data.id);

    if (!movePlayer)
        return;

    movePlayer.sprite.x = data.x;
    movePlayer.sprite.y = data.y;
}

Game.onRemovePlayer = function(data) {
    var removePlayer = playerById(data.id);

    if (!removePlayer)
        return;

    removePlayer.sprite.kill();

    players.splice(players.indexOf(removePlayer), 1);
}

/* MOBS */

Game.onNewMob = function(data) {
    console.log("New mob");

    mobs.push(new Mob(data.id, game, data.x, data.y));
}

Game.onMoveMob = function(data) {
    var moveMob = mobById(data.id);

    if (!moveMob)
        return;

    moveMob.sprite.x = data.x;
    moveMob.sprite.y = data.y;
}

Game.onRemoveMob = function(data) {
    var removeMob = mobById(data.id);

    if (!removeMob)
        return;

    removeMob.sprite.kill();

    mobs.splice(players.indexOf(removeMob), 1);
}

Game.onRemoveAllMobs = function(data) {
    for (var i = 0; i < mobs.length; i++) {
        mobs[i].sprite.kill();
    }
    mobs = [];
}

/* HELPER FUNCTIONS */

Game.getPlayer = function() {
    return player;
}

Game.getPlayers = function() {
    return players;
}

function randomInt(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function playerById(id) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].sprite.name === id)
            return players[i];
    }
    return false;
}

function mobById(id) {
    for (var i = 0; i < mobs.length; i++) {
        if (mobs[i].sprite.name === id)
            return mobs[i];
    }
    return false;
}






