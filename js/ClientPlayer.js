ClientPlayer = function(game, startX, startY) {
    var x = startX;
    var y = startY;

    this.game = game;
    this.sprite = game.add.sprite(x, y, 'characters', sprites["white_male"]);

    // body
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.bounce.setTo(1, 1);
    this.sprite.anchor.setTo(0.5, 0.5);

    // stats
    this.speed = 65;
    this.isAttacking = false;

    // equipment
    this.weapon = this.sprite.addChild(game.make.sprite(11, 0, 'characters', sprites["battleaxe"]));
    this.weapon.anchor.setTo(0.5, 0.5);
}

ClientPlayer.prototype.update = function() {
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
}

/* ACTIONS */

ClientPlayer.prototype.attack = function() {
    if (this.isAttacking)
        return;
    this.isAttacking = true;
    slashfx = game.add.sprite(player.sprite.x + 15, player.sprite.y, 'slash');
    slashfx.anchor.setTo(0.5, 0.5);

    this.weapon.angle = 20;
    this.game.time.events.add(125, this.stopAtk, this);
}

ClientPlayer.prototype.stopAtk = function() {
    this.isAttacking = false;
    slashfx.kill();
    this.weapon.angle = 0;
}

/* MOVEMENT */

ClientPlayer.prototype.moveUp = function() {
    this.sprite.body.velocity.y -= this.speed;
}

ClientPlayer.prototype.moveDown = function() {
    this.sprite.body.velocity.y += this.speed;
}

ClientPlayer.prototype.moveLeft = function() {
    this.sprite.body.velocity.x -= this.speed;
}

ClientPlayer.prototype.moveRight = function() {
    this.sprite.body.velocity.x += this.speed;
}
