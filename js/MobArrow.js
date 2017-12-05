MobArrow = function(index, game, startX, startY, target) {
    var x = startX;
    var y = startY;

    this.game = game;

    this.sprite = game.add.sprite(x, y, 'star');
    this.sprite.name = index.toString();
    this.sprite.anchor.setTo(0.5, 0.5);
    
    // arrow target
    this.target = target;

    // body
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
}

MobArrow.prototype.update = function() {
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;

    let distance = game.physics.arcade.distanceBetween(this.sprite, this.target);
    if (distance < 3) {
        return true;
    }

    game.physics.arcade.moveToObject(this.sprite, this.target, 150);
}

MobArrow.prototype.destroy = function() {
    this.sprite.kill();
}


