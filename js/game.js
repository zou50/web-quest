var Game = {};

Game.create = function() {
    Game.playerMap = {};

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

    // input
    cursors = game.input.keyboard.createCursorKeys();

    // client
    Client.askNewPlayer();
}

Game.update = function() {
    if (cursors.up.isDown)
        Client.handleMove(0, -1);
    else if (cursors.down.isDown)
        Client.handleMove(0, 1);
    if (cursors.left.isDown)
        Client.handleMove(-1, 0);
    else if (cursors.right.isDown)
        Client.handleMove(1, 0);
}

Game.render = function() {
    // game.debug.cameraInfo(game.camera, 32, 32);
}

Game.addNewPlayer = function(id, x, y) {
    console.log("game new player");
    var newP = game.add.sprite(x, y, 'player');
    Game.playerMap[id] = newP;
    game.physics.arcade.enable(newP);
    console.log(id);
}

Game.removePlayer = function(id) {
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
}

Game.movePlayer = function(id, x, y) {
    var player = Game.playerMap[id];
    player.x = x;
    player.y = y;
    console.log(player.body.x);
}








