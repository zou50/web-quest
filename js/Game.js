var Game = {};
var timer;

Game.preload = function() {
    game.stage.disableVisibilityChange = true;
}

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

    // items on ground
    items = [];

    // client player
    player = new ClientPlayer(game, randomInt(0, 200), randomInt(0, 200));;
    game.camera.follow(player.sprite);

	defeatedEnemies = 0;
	
    // input
    cursors = game.input.keyboard.createCursorKeys();
	keys = game.input.keyboard.addKeys({
        'action': Phaser.KeyCode.Z,
        'cancel': Phaser.KeyCode.X,
        'item': Phaser.KeyCode.A,
        // admin
        'spawnG': Phaser.KeyCode.ONE,
        'spawnA': Phaser.KeyCode.TWO,
        'spawnI': Phaser.KeyCode.THREE,
        'removeAllM': Phaser.KeyCode.Q,
        'removeAllI': Phaser.KeyCode.W,
        'debugMobs': Phaser.KeyCode.P,
        'debugPlayer': Phaser.KeyCode.O
    });
    keys.spawnG.onDown.add(() => {
        socket.emit('new mob', {t: "Goblin", x: randomInt(0, 200), y: randomInt(0, 200)});
    });
    keys.spawnA.onDown.add(() => {
        socket.emit('new mob', {t: "Archer", x: randomInt(0, 200), y: randomInt(0, 200)});
    });
    keys.spawnI.onDown.add(() => {
        socket.emit('new item', {x: randomInt(0, 200), y: randomInt(0, 200)});
    });
    keys.removeAllM.onDown.add(() => {
        socket.emit('remove all mobs');
    });
    keys.removeAllI.onDown.add(() => {
        socket.emit('remove all items');
    });
    keys.debugMobs.onDown.add(() => {
        console.log(mobs);
    });
    keys.debugPlayer.onDown.add(() => {
        console.log(player);
        console.log(player.sprite.x, player.sprite.y);
    });
 
    //On attack press
    keys.action.onDown.add(player.attack, player);

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

    // Damage mob message received
    socket.on('damage mob', Game.onDamageMob);

    // Remove mob message received
    socket.on('remove mob', Game.onRemoveMob);

    // Remove all mobs message received
    socket.on('remove all mobs', Game.onRemoveAllMobs);

    // New item message received
    socket.on('new item', Game.onNewItem);

    // Remove item message received
    socket.on('remove item', Game.onRemoveItem);

    // Remove all items message received
    socket.on('remove all items', Game.onRemoveAllItems);
}

Game.update = function() {
    game.physics.arcade.collide(player.sprite, blockedLayer);

    for (var i = 0; i < players.length; i++) {
        if (players[i].sprite.alive) {
            players[i].update();
            game.physics.arcade.collide(player.sprite, players[i].sprite);
        }
    }
    for (var i = 0; i < mobs.length; i++) {
        if (mobs[i].alive) {
            if (game.physics.arcade.overlap(player.swing.children[0], mobs[i].sprite)) {
                player.swing.children[0].kill();
                var kill = mobs[i].damage();
                if (kill) {
                    socket.emit('remove mob', {id: mobs[i].sprite.name});
                    defeatedEnemies++;
                } else {
                    socket.emit('damage mob', {id: mobs[i].sprite.name, hp: mobs[i].health});
                }
            }
            game.physics.arcade.collide(mobs[i].sprite, blockedLayer);
            mobs[i].update();
            if (mobs[i].target)
                socket.emit('move mob', {id: mobs[i].sprite.name, x: mobs[i].sprite.x, y: mobs[i].sprite.y});
        }
    }
    this.purgeMobs();
    player.update();
	
    if (cursors.up.isDown)
        player.moveUp();
    else if (cursors.down.isDown)
        player.moveDown();
    if (cursors.left.isDown)
        player.moveLeft();
    else if (cursors.right.isDown)
        player.moveRight();

    socket.emit('move player', { 
        x: player.sprite.x, y: player.sprite.y,
        f: player.facing, d: player.direction,
        a: player.isAttacking
    });
}

Game.render = function() {
    game.debug.text('Enemies defeated: ' + defeatedEnemies, 8, 16);
}

/* CONNECTIONS */

Game.onSocketConnected = function() {
    console.log("Connected");

    socket.emit('new player', {
        x: player.sprite.x, y: player.sprite.y,
        f: player.facing, d: player.direction,
        a: player.isAttacking
    });
}

Game.onSocketDisconnected = function() {
    console.log("Disconnected");
}

/* PLAYERS */

Game.onNewPlayer = function(data) {
    console.log("New player");

    var newPlayer = new RemotePlayer(data.id, game, player.sprite, data.x, data.y);
    newPlayer.facing = data.f;
    newPlayer.direction = data.d;
    newPlayer.isAttacking = data.a;

    players.push(newPlayer);
}

Game.onMovePlayer = function(data) {
    var movePlayer = playerById(data.id);

    if (!movePlayer)
        return;

    movePlayer.sprite.x = data.x;
    movePlayer.sprite.y = data.y;
    movePlayer.facing = data.f;
    movePlayer.direction = data.d;
    movePlayer.isAttacking = data.a;
}

Game.onRemovePlayer = function(data) {
    var removePlayer = playerById(data.id);

    if (!removePlayer)
        return;

    removePlayer.destroy();

    players.splice(players.indexOf(removePlayer), 1);
}

/* MOBS */

Game.onNewMob = function(data) {
    console.log("New mob");
    if (data.t === "Goblin")
        mobs.push(new MobGoblin(data.id, game, data.x, data.y));
    else if (data.t === "Archer")
        mobs.push(new MobArcher(data.id, game, data.x, data.y));
}

Game.onMoveMob = function(data) {
    var moveMob = mobById(data.id);

    if (!moveMob)
        return;

    moveMob.sprite.x = data.x;
    moveMob.sprite.y = data.y;
}

Game.onDamageMob = function(data) {
    var damageMob = mobById(data.id);

    if (!damageMob)
        return;

    damageMob.health = data.hp;
}

Game.onRemoveMob = function(data) {
    var removeMob = mobById(data.id);

    if (!removeMob)
        return;

    removeMob.alive = false;
}

Game.purgeMobs = function() {
    for (var i = mobs.length - 1; i >= 0; i--) {
        if (!mobs[i].alive) {
            mobs[i].destroy();
            mobs.splice(i, 1);
        }
    }
}

Game.onRemoveAllMobs = function(data) {
    for (var i = 0; i < mobs.length; i++) {
        mobs[i].destroy();
    }
    mobs = [];
}

/* ITEMS */

Game.onNewItem = function(data) {
    console.log("New item");
    items.push(new Item(data.id, game, data.x, data.y));
}

Game.onRemoveItem = function(data) {
    var removeItem = itemById(data.id);

    if (!removeItem)
        return;

    removeItem.destroy();

    items.splice(items.indexOf(removeItem), 1);
}

Game.onRemoveAllItems = function(data) {
    for (var i = 0; i < items.length; i++) {
        items[i].destroy();
    }
    items = [];
}

/* HELPER FUNCTIONS */

Game.getPlayer = function() {
    return player;
}

Game.getPlayers = function() {
    return players;
}

Game.getMobs = function() {
    return mobs;
}

function randomInt(low, high) {
    return game.rnd.between(low, high);
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






