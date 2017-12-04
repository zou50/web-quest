var Boot = {};

Boot.preload = function() {

}

Boot.create = function() {
    // black background
    this.game.stage.backgroundColor = "#000";

    // scaling options
    this.game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    this.game.scale.setUserScale(2, 2);
    this.game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

    // center
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;

    // physics
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.state.start('Preload');
}