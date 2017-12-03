var WebQuest = WebQuest || {};

// loading
WebQuest.Preload = function() {};

WebQuest.Preload.prototype = {
    preload: function() {
        // loading screen

        // load assets
        this.load.tilemap('map1',
            'assets/maps/map1.json',
            null,
            Phaser.Tilemap.TILED_JSON);
        
        this.load.image('gameTiles', 'assets/spritesheets/world.png');
    },
    create: function() {
        this.state.start('Game');
    }
}
