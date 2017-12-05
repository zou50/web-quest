RemotePlayer = function(index, game, sprite, startX, startY) {
    var x = startX;
    var y = startY;

    this.game = game;
    
    this.sprite = game.add.sprite(x, y, 'characters', sprite.frame);
    this.sprite.name = index.toString();

    // body
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = true;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.anchor.setTo(0.5, 0.5);

    console.log(this);

    // equipment
    this.weapon = this.sprite.addChild(game.make.sprite(12, 0, 'characters', sprites["battleaxe"]));
    this.weapon.anchor.setTo(0.5, 0.5);
}

RemotePlayer.prototype.update = function() {
    this.sprite.scale.x = this.direction;

    if (this.isAttacking) {
        this.weapon.pivot.setTo(-10, -3);
        this.weapon.angle = 90;
    } else {
        this.weapon.pivot.setTo(0, 0);
        this.weapon.angle = 0;
    }
}

RemotePlayer.prototype.destroy = function() {
    this.sprite.kill();
    this.weapon.kill();
}