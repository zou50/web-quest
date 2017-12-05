// ITEM ON THE GROUND

Item = function(index, game, startX, startY) {
    var x = startX;
    var y = startY;

    this.game = game;

    this.sprite = game.add.sprite(x, y, 'characters', sprites["helmet2"]);
    this.sprite.name = index.toString();
    this.sprite.anchor.setTo(0.5, 0.5);
}

Item.prototype.destroy = function() {
    this.sprite.kill();
}