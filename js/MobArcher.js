MobArcher = function(index, game, startX, startY) {
    this.sprite = game.add.sprite(startX, startY, 'characters', sprites["black_male"]);
    this.weapon = this.sprite.addChild(game.make.sprite(11, 0, 'characters', sprites["shortbow"]));

    Mob.call(this, index, game, startX, startY);
}

MobArcher.prototype = Object.create(Mob.prototype);
MobArcher.prototype.constructor = MobArcher;


