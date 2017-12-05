var Preload = {};

Preload.preload = function() {
    // load assets
    game.load.tilemap('map1',
        'assets/maps/map1.json',
        null,
        Phaser.Tilemap.TILED_JSON);
    // game.load.tilemap('map2',
    //     'assets/maps/map2.json',
    //     null,
    //     Phaser.Tilemap.TILED_JSON);

	// 12x54 || 0-11, 0-53
	game.load.spritesheet('characters','assets/spritesheets/characters.png', 17, 17, 636, 0, 0);

    game.load.image('gameTiles', 'assets/spritesheets/world.png', 16, 16);
    game.load.image('player', 'assets/images/star.png');
    game.load.image('npc', 'assets/images/enemy.png');
    game.load.image('slash', 'assets/images/slash.png'); 
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
    sprites["white_male"] = 0;
    sprites["white_female"] = 1;
    sprites["tan_male"] = 54;
    sprites["tan_female"] = 55;
    sprites["black_male"] = 108;
	sprites["black_female"] = 109;
	sprites["green_close"] = 162;
	sprites["green_open"] = 163;

    // pants
	sprites["black_pants"] = 3;
	sprites["brown_pants"] = 57;
	sprites["white_pants"] = 111;
	sprites["beige_pants"] = 165;
	
    // shoes
	sprites["black_shoes"] = 4;
	sprites["brown_shoes"] = 58;
	sprites["white_shoes"] = 112;
	sprites["beige_shoes"] = 166;
    
    // tops
	sprites["top1"] = 6;		
	sprites["top2"] = 7;
	sprites["top3"] = 8;
	sprites["top4"] = 9;
	sprites["top5"] = 10;
	sprites["top6"] = 11;
	sprites["top7"] = 12;
	sprites["top8"] = 13;
	sprites["top9"] = 14;
	sprites["top10"] = 15;
	sprites["top11"] = 16;
	sprites["top12"] = 17;
	
    // hair 19-27
	sprites["hair1"] = 19;
	sprites["hair2"] = 20;
	sprites["hair3"] = 21;
	sprites["hair4"] = 22;
	sprites["hair5"] = 23;
	sprites["hair6"] = 24;
	sprites["hair7"] = 25;
	sprites["hair8"] = 26;
	
    // helmets
	sprites["helmet1"] = 28;
	sprites["helmet2"] = 29;
	sprites["helmet3"] = 30;
	sprites["helmet4"] = 31;

    // shields 
	sprites["shields"] = 33;
	sprites["shieldm"] = 34;
	sprites["shieldl"] = 35;
	sprites["shieldxl"] = 36;
	
    // melee 
	sprites["staff1"] = 42;
	sprites["staff2"] = 43;
	sprites["staff3"] = 44;
	sprites["sword1"] = 45;
	sprites["sword2"] = 46;
	sprites["mace"] = 47;
	sprites["dagger"] = 48;
	sprites["spear"] = 49;
	sprites["handaxe"] = 50;
	sprites["battleaxe"] = 51;
	
    // bows 
	sprites["shortbow"] = 52;
	sprites["longbow"] =53;
}


