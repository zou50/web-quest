ClientPlayer = function(game, startX, startY) {
    var x = startX;
    var y = startY;
	this.facing = "right";
    this.direction = 1;

    this.game = game;
    
    this.sprite = game.add.sprite(x, y, 'characters', sprites["white_male"]);

    // status
    this.speed = 65;
    this.isAttacking = false;
    this.health = 20;
    this.alive = true;
    this.nextHeal = 0;
    this.healRate = 5000;

    // body
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.bounce.setTo(1, 1);
    this.sprite.anchor.setTo(0.5, 0.5);

    this.healthText = game.add.text(this.sprite.x, this.sprite.y - 12, this.health);
    this.healthText.anchor.setTo(0.5, 0.5);
    this.healthText.x = Math.floor(this.healthText.x);
    this.healthText.y = Math.floor(this.healthText.y);
    this.healthText.fontSize = 12;

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
	this.swing = this.game.add.group();
    this.swing.enableBody = true;
	this.swing.physicsBodyType = Phaser.Physics.ARCADE;
}

ClientPlayer.prototype.update = function() {
    if (game.time.now > this.nextHeal) {
        this.nextHeal = game.time.now + this.healRate;
        if (this.health < 20)
            this.health += 1;
    }
    this.healthText.text = this.health;
    this.healthText.x = this.sprite.x;
    this.healthText.y = this.sprite.y - 12;
    
    this.sprite.scale.x = this.direction;
    this.sprite.body.velocity.x = 0;
    this.sprite.body.velocity.y = 0;
}

ClientPlayer.prototype.damage = function() {
    this.health -= 1;
    if (this.health <= 0) {
        this.alive = false;
        return true;
    }
    return false;
}

/* ACTIONS */

ClientPlayer.prototype.attack = function() {
    if (this.isAttacking)
        return;
   
	//get player direction
	xoff = 15;
	yoff = 0;
	rotation = 0;
    switch(this.facing) {
		case "right":
			xoff = 15;
			yoff = 0;
			rotation = 0;
			break;
		case "left":
			xoff = -15;
			yoff = 0;
			rotation = 180;
			break;
		case "up":
			xoff = 0;
			yoff = -15;
			rotation = 270;
			break;
		case "down":
			xoff = 0;
			yoff = 15;
			rotation = 90;
			break;
	}
	 // all mobs
	var mobs = Game.getMobs();
    this.isAttacking = true;

    slashfx = this.game.add.sprite(this.sprite.x + xoff, this.sprite.y + yoff, 'slash');
    slashfx.angle = rotation;
    slashfx.anchor.setTo(0.5, 0.5);

    slashBody = this.swing.create(this.sprite.x + xoff, this.sprite.y + yoff);
	slashBody.angle = rotation;
    slashBody.anchor.setTo(0.5, 0.5);
    slashBody.enableBody = true;

    this.weapon.pivot.setTo(-10, -3);
    this.weapon.angle = 90;
    this.game.time.events.add(125, this.stopAtk, this);
}

ClientPlayer.prototype.stopAtk = function() {
    this.isAttacking = false;
    this.swing.remove(slashBody);
    slashfx.kill();
    slashBody.kill();
    this.weapon.angle = 0;
    this.weapon.pivot.setTo(0, 0);
}

/* MOVEMENT */

ClientPlayer.prototype.moveUp = function() {
    this.sprite.body.velocity.y -= this.speed;
	this.facing = "up";
}

ClientPlayer.prototype.moveDown = function() {
    this.sprite.body.velocity.y += this.speed;
	this.facing = "down";
}

ClientPlayer.prototype.moveLeft = function() {
    this.sprite.body.velocity.x -= this.speed;
    this.direction = -1;
	this.facing = "left";
}

ClientPlayer.prototype.moveRight = function() {
    this.sprite.body.velocity.x += this.speed;
    this.direction = 1;
	this.facing = "right";
}
