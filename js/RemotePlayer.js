var RemotePlayer = function (index, game, player, startX, startY) {
    var x = startX;
    var y = startY;

    this.game = game;
    this.health = 3;
    this.player = player;
    this.alive = true;

    this.player = game.add.sprite(x, y, 'characters', sprites["white"]);

    this.player.name = index.toString();
    game.physics.enable(this.player, Phaser.Physics.ARCADE);
    this.player.body.immovable = true;
    this.player.body.collideWorldBounds = true;

    this.lastPosition = { x: x, y: y }
}

RemotePlayer.prototype.update = function () {
    this.lastPosition.x = this.player.x;
    this.lastPosition.y = this.player.y;
}

window.RemotePlayer = RemotePlayer;