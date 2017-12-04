var Mob = function(index, game, startX, startY) {
    var x = startX;
    var y = startY;

    this.game = game;

    this.sprite = game.add.sprite(x, y, 'characters', sprites["green_open"]);
    this.sprite.name = index.toString();
    this.sprite.anchor.setTo(0.5, 0.5);

    // currently chasing
    this.target = null;

    // body
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = true;
    this.sprite.body.collideWorldBounds = true;

    this.lastPosition = {x: x, y: y};
}

Mob.prototype.update = function() {
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;

    this.lastPosition.x = this.sprite.x;
    this.lastPosition.y = this.sprite.y;

    this.followPlayer();
}

Mob.prototype.followPlayer = function() {
    var player = Game.getPlayer();
    game.physics.arcade.collide(this.sprite, player);

    let distance = game.physics.arcade.distanceBetween(this.sprite, player);

    // has other target
    if (this.target && this.target != player) {
        // check if target is closer
        let distanceT = game.physics.arcade.distanceBetween(this.sprite, this.target);
        if (distanceT < distance)
            return;
    }

    this.target = player;
    if (distance < 80) {
        if (distance < 23) return;
        console.log("following");
        game.physics.arcade.moveToObject(this.sprite, this.target, 45);
    }
    else {
        this.target = null;
    }
}
