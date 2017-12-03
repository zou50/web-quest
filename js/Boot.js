/* Primary Phaser Game Object */
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
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // center
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        // physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.state.start('Preload');
    }
}

/******************************/


