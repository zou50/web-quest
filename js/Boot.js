var Boot = {};

Boot.preload = function() {
    
}

Boot.create = function() {
    // black background
    game.stage.backgroundColor = "#000";

    // scaling options
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    game.scale.setUserScale(2, 2);
    game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(game.canvas);

    // center
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;

    // physics
    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.state.start('Preload');
}