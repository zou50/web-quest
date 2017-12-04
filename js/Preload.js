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
	game.load.spritesheet('characters','assets/spritesheets/characters.png',16,16,636,0,1);
}

Preload.create = function() {
    loadSprites();
    this.state.start('Game');
}

// associative array
// dictionary["key"] = value
function loadSprites() {
    sprites = {};

    // characters
    sprites["white"] = 0;
    sprites["white_open"] = 1;
    sprites["tan"] = 54;
    sprites["tan_open"] = 55;
    sprites["BLAAAACK"] = 108;

    // pants

    // shoes

    // tops

    // hair

    // helmets

    // shields

    // melee

    // bows
}


