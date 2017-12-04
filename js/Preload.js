var Preload = {};

Preload.preload = function() {
    // load assets
    game.load.tilemap('map1',
        'assets/maps/map1.json',
        null,
        Phaser.Tilemap.TILED_JSON);

    game.load.image('gameTiles', 'assets/spritesheets/world.png', 16, 16);
    game.load.image('player', 'assets/images/star.png');
    game.load.image('npc', 'assets/images/enemy.png');
	game.load.image('slash', 'assets/images/slash.png');   
	
	//12 x 53
	game.load.spritesheet('characters','assets/spritesheets/characters.png',16,16,636);
	
}

Preload.create = function() {
    this.state.start('Game');
}