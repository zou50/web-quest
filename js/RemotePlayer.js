RemotePlayer = function(index, game, sprite, startX, startY) {
    var x = startX;
    var y = startY;

    this.game = game;
    this.sprite = sprite;

    this.sprite.name = index.toString();

    // body
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = true;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.anchor.setTo(0.5, 0.5);

    // equipment
    this.weapon = game.add.sprite(this.sprite.x + 11, this.sprite.y, 'characters', sprites["battleaxe"]);
    this.weapon.anchor.setTo(0.5, 0.5);
}

RemotePlayer.prototype.update = function() {
    this.weapon.x = this.sprite.x + 11;
    this.weapon.y = this.sprite.y;
}

RemotePlayer.prototype.destroy = function() {
    this.sprite.kill();
    this.weapon.kill();
}