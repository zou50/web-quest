RemotePlayer = function(index, game, sprite, startX, startY) {
    var x = startX;
    var y = startY;

    this.game = game;
    
    this.sprite = game.add.sprite(x, y, 'characters', sprite.frame);
    this.sprite.name = index.toString();

    // body
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = true;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.anchor.setTo(0.5, 0.5);

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
}

RemotePlayer.prototype.update = function() {
    this.sprite.scale.x = this.direction;

    if (this.isAttacking) {
        this.weapon.pivot.setTo(-10, -3);
        this.weapon.angle = 90;
    } else {
        this.weapon.pivot.setTo(0, 0);
        this.weapon.angle = 0;
    }
}

RemotePlayer.prototype.destroy = function() {
    this.sprite.kill();
    this.weapon.kill();
}