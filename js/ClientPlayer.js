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
    // helmet        
    this.helmet = this.sprite.addChild(game.make.sprite(-1, 0, 'characters', sprites["helmet1"]));
    if (this.helmet) {
        this.helmet.anchor.setTo(0.5, 0.5);
    }
    // top
    this.top = this.sprite.addChild(game.make.sprite(-1, 0, 'characters', sprites["top1"]));
    if (this.top) {
        this.top.anchor.setTo(0.5, 0.5);
    }
    // pants
    this.pants = this.sprite.addChild(game.make.sprite(-1, 0, 'characters', sprites["black_pants"]));
    if (this.pants) {
        this.pants.anchor.setTo(0.5, 0.5);
    }
    // shoes
    this.shoes = this.sprite.addChild(game.make.sprite(-1, 0, 'characters', sprites["black_shoes"]));
    if (this.shoes) {
        this.shoes.anchor.setTo(0.5, 0.5);
    }
    // shield
    this.shield = this.sprite.addChild(game.make.sprite(-12, 0, 'characters', sprites["shields"]));
    if (this.shield) {
        this.shield.anchor.setTo(0.5, 0.5);
    }
    // weapon
    this.weapon = this.sprite.addChild(game.make.sprite(12, 0, 'characters', sprites["battleaxe"]));
    if (this.weapon) {
        this.weapon.anchor.setTo(0.5, 0.5);
    }
	swing = this.game.add.group();
	swing.physicsBodyType = Phaser.Physics.ARCADE;
}

ClientPlayer.prototype.update = function() {
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
}

/* ACTIONS */

ClientPlayer.prototype.attack = function() {
    if (this.isAttacking)
        return;
    // all mobs
    var mobs = Game.getMobs();
    this.isAttacking = true;
    slashfx = swing.create(player.sprite.x + 15, player.sprite.y, 'slash');
    slashfx.anchor.setTo(0.5, 0.5);

    this.weapon.pivot.setTo(-10, -3);
    this.weapon.angle = 90;
    this.game.time.events.add(125, this.stopAtk, this);
}

ClientPlayer.prototype.stopAtk = function() {
    this.isAttacking = false;
    slashfx.kill();
    this.weapon.angle = 0;
    this.weapon.pivot.setTo(0, 0);
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
