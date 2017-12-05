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

    // enemy projectiles
    mobArrows = [];

    // client player
    player = new ClientPlayer(game, randomInt(20, 200), randomInt(20, 200));;
    game.camera.follow(player.sprite);

	//Scoreboard
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
        socket.emit('new mob', {t: "Goblin", x: randomInt(275, 350), y: randomInt(190, 220)});
    });
    keys.spawnA.onDown.add(() => {
        socket.emit('new mob', {t: "Archer", x: randomInt(275, 350), y: randomInt(190, 220)});
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

    // New mob arrow message received
    socket.on('new mob arrow', Game.onNewMobArrow);

    // Move mob arrow message received
    socket.on('move mob arrow', Game.onMoveMobArrow);

    // Remove mob arrow message received
    socket.on('remove mob arrow', Game.onRemoveMobArrow);
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
            if (mobs[i].target) {
                socket.emit('move mob', {
                    id: mobs[i].sprite.name,
                    x: mobs[i].sprite.x, y: mobs[i].sprite.y});
            }
        }
    }
    for (var i = 0; i < mobArrows.length; i++) {
        end = mobArrows[i].update();
        if (game.physics.arcade.overlap(mobArrows[i].sprite, player.sprite)) {
            socket.emit('remove mob arrow', {id: mobArrows[i].sprite.name});
            var kill = player.damage();
            if (kill) {
                console.log("dead");
                player.sprite.x = randomInt(50, 100);
                player.sprite.y = randomInt(50, 100);
                player.health = 20;
                defeatedEnemies = 0;
            }
        }
        else if (end) {
            socket.emit('remove mob arrow', {id: mobArrows[i].sprite.name});
        } else {
            socket.emit('move mob arrow', {x: mobArrows[i].spritex, y: mobArrows[i].spritey});
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
    console.log(data);
    console.log("New mob");
    if (data.t === "Goblin")
        mobs.push(new MobGoblin(data.id, game, data.x, data.y, data.hp));
    else if (data.t === "Archer")
        mobs.push(new MobArcher(data.id, game, data.x, data.y, data.hp));
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

/* PROJECTILES */

Game.onNewMobArrow = function(data) {
    var newMobArrow = new MobArrow(data.id, game, data.x, data.y, data.target);
    mobArrows.push(newMobArrow);
}

Game.onMoveMobArrow = function(data) {
    var moveMobArrow = mobArrowById(data.id);

    if (!moveMobArrow)
        return;

    moveMobArrow.x = data.x;
    moveMobArrow.y = data.y;
}

Game.onRemoveMobArrow = function(data) {
    var removeMobArrow = mobArrowById(data.id);

    if (!removeMobArrow)
        return;

    removeMobArrow.destroy();

    mobArrows.splice(mobArrows.indexOf(removeMobArrow), 1);
}

Game.sendMobArrow = function(arrowInfo) {
    socket.emit('new mob arrow', {x: arrowInfo.x, y: arrowInfo.y, target: arrowInfo.target});
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

Game.getItems = function() {
    return items;
}

Game.getMobArrows = function() {
    return mobArrows;
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

function itemById(id) {
    for (var i = 0; i < items.length; i++) {
        if (items[i].sprite.name === id)
            return items[i];
    }
    return false;
}

function mobArrowById(id) {
    for (var i = 0; i < mobArrows.length; i++) {
        if (mobArrows[i].sprite.name === id)
            return mobArrows[i];
    }
    return false;
}






