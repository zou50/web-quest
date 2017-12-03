var WebQuest = WebQuest || {};

WebQuest.Boot = function() {};

WebQuest.Boot.prototype = {
    preload: function() {
        // loading screen
        // this.load.image();
    },
    create: function() {
        // black background
        this.game.stage.backgroundColor = "#000";

        // scaling options
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // center
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;

        // physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.state.start('Preload');
    }
}
