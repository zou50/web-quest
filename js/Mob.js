Mob = function(index, game, startX, startY) {
    var x = startX;
    var y = startY;

    this.game = game;

    this.sprite.name = index.toString();
    this.sprite.anchor.setTo(0.5, 0.5);
    this.weapon.anchor.setTo(0.5, 0.5);

    // status
    this.health = 3;
    this.alive = true;
	
    // currently chasing
    this.target = null;

    // body
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = true;
    this.sprite.body.collideWorldBounds = true;

    console.log(this.sprite.health);
}

Mob.prototype.update = function() {
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;

    this.followPlayer();
}

Mob.prototype.damage = function() {
    this.health -= 1;
    if (this.health <= 0) {
        this.alive = false;
        return true;
    }
    return false;
}

Mob.prototype.followPlayer = function() {
    var player = Game.getPlayer().sprite;
    game.physics.arcade.collide(this.sprite, player);

    let distance = game.physics.arcade.distanceBetween(this.sprite, player);

    if (this.target && this.target != player)
        return;

    if (distance < 80) {
        this.target = player;
        if (distance < 23) 
            return;
        game.physics.arcade.moveToObject(this.sprite, this.target, 45);
    } else {
        this.target = null;
    }
}

Mob.prototype.destroy = function() {
    this.sprite.kill();
    this.weapon.kill();
}



