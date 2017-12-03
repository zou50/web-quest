var WebQuest = WebQuest || {};

// loading
WebQuest.Preload = function() {};

WebQuest.Preload.prototype = {
    preload: function() {
        // loading screen

        // load assets
        this.game.load.tilemap('map1',
            'assets/maps/map1.json',
            null,
            Phaser.Tilemap.TILED_JSON);

        this.game.load.image('gameTiles', 'assets/spritesheets/world.png', 16, 16);
        this.game.load.image('player', 'assets/images/star.png')
    },
    create: function() {
        this.state.start('Game');
    }
}
