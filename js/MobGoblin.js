MobGoblin = function(index, game, startX, startY) {
    this.sprite = game.add.sprite(startX, startY, 'characters', sprites["green_open"]);
    this.weapon = this.sprite.addChild(game.make.sprite(11, 0, 'characters', sprites["battleaxe"]));

    Mob.call(this, index, game, startX, startY);
}

MobGoblin.prototype = Object.create(Mob.prototype);
MobGoblin.prototype.constructor = MobGoblin;


