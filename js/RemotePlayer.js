RemotePlayer = function(index, game, sprite, startX, startY) {
    var x = startX;
    var y = startY;
    this.facing = "right";
    this.direction = 1;

    this.game = game;
    
    this.sprite = game.add.sprite(x, y, 'characters', sprite.frame);
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
    this.sprite.scale.x = this.direction;
    this.weapon.x = this.sprite.x + 11;
    this.weapon.y = this.sprite.y;
}

RemotePlayer.prototype.destroy = function() {
    this.sprite.kill();
    this.weapon.kill();
}