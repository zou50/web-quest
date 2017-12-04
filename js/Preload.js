var Preload = {};

Preload.preload = function() {
    // load assets
    this.game.load.tilemap('map1',
        'assets/maps/map1.json',
        null,
        Phaser.Tilemap.TILED_JSON);

    this.game.load.image('gameTiles', 'assets/spritesheets/world.png', 16, 16);
    this.game.load.image('player', 'assets/images/star.png');
}

Preload.create = function() {
    this.state.start('Game');
}