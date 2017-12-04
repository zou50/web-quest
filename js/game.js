var Game = {};

Game.create = function() {
    Game.playerMap = {};

    // initialize tiled map
    this.map = this.game.add.tilemap('map1', 16, 16);
    this.map.addTilesetImage('tiles', 'gameTiles');

    // create tiled map layers
    this.backgroundLayer = this.map.createLayer(0);
    this.foregroundLayer = this.map.createLayer(1);
    this.blockedLayer = this.map.createLayer(2);
    this.backgroundLayer.resizeWorld();

    this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');

    // camera settings
    this.game.camera.setSize(400, 320);
	
	npcs = this.game.add.group();
	npcs.enableBody = true;
	var npc = npcs.create(300,176,'player');

    // input
    this.cursors = this.game.input.keyboard.createCursorKeys();

    // client
    Client.askNewPlayer();
	
	
}

Game.update = function() {
    // warning: will throw maximum call stack error (too many inputs)
    if (this.cursors.up.isDown || this.cursors.down.isDown
        || this.cursors.left.isDown || this.cursors.right.isDown) {
        // Client.handleMove(this.cursors);
    }
}

Game.render = function() {
    // this.game.debug.cameraInfo(this.game.camera, 32, 32);
}

Game.addNewPlayer = function(id, x, y) {
    console.log("game new player");
    Game.playerMap[id] = this.game.add.sprite(x, y, 'player');
}

Game.removePlayer = function(id) {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
}

Game.movePlayer = function(id, cursors) {
    var player = Game.playerMap[id];
    player.body.velocity.y = 0;
    player.body.velocity.x = 0;

    if (cursors.up.isDown) {
      player.body.velocity.y -= 50;
    }
    else if (cursors.down.isDown) {
      player.body.velocity.y += 50;
    }
    if (cursors.left.isDown) {
      player.body.velocity.x -= 50;
    }
    else if (cursors.right.isDown) {
      player.body.velocity.x += 50;
    }
}








