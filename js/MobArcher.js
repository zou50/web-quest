MobArcher = function(index, game, startX, startY, hp) {
    this.sprite = game.add.sprite(startX, startY, 'characters', sprites["black_male"]);
    this.weapon = this.sprite.addChild(game.make.sprite(11, 0, 'characters', sprites["shortbow"]));

    Mob.call(this, index, game, startX, startY, hp);

    this.mobArrows = Game.getMobArrows();
    this.fireRate = 1000;
    this.nextFire = 0;
}

MobArcher.prototype = Object.create(Mob.prototype);
MobArcher.prototype.constructor = MobArcher;

MobArcher.prototype.followPlayer = function() {
    var player = Game.getPlayer().sprite;
    game.physics.arcade.collide(this.sprite, player);

    if (this.target && this.target != player)
        return;

    let distance = game.physics.arcade.distanceBetween(this.sprite, player);

    if (distance < 120) {
        this.target = player;
        if (game.time.now > this.nextFire) {
            this.nextFire = game.time.now + this.fireRate;
            let arrowInfo = {
                x: this.sprite.x,
                y: this.sprite.y,
                target: {x: player.x, y: player.y}
            }
            Game.sendMobArrow(arrowInfo);
        }
    } else {
        this.target = null;
    }
}


