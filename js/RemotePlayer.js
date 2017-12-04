var RemotePlayer = function(index, game, sprite, startX, startY) {
    var x = startX;
    var y = startY;

    this.game = game;
    this.sprite = sprite;

    this.sprite = game.add.sprite(x, y, 'characters', sprites["white"]);
    this.sprite.name = index.toString();
    this.sprite.anchor.setTo(0.5, 0.5);

    // body
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = true;
    this.sprite.body.collideWorldBounds = true;

    this.lastPosition = { x: x, y: y }
}

RemotePlayer.prototype.update = function() {
    this.lastPosition.x = this.sprite.x;
    this.lastPosition.y = this.sprite.y;
}
