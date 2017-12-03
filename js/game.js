var WebQuest = WebQuest || {};

// title
WebQuest.Game = function() {};

WebQuest.Game.prototype = {
    create: function() {
        this.map = this.game.add.tilemap('map1', 16, 16);

        this.map.addTilesetImage('tiles', 'gameTiles');

        this.backgroundLayer = this.map.createLayer(0);
        this.foregroundLayer = this.map.createLayer(1);
        this.blockedLayer = this.map.createLayer(2);
        this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');
        this.backgroundLayer.resizeWorld();

        this.player = this.game.add.sprite(0, 0, 'player');

        this.game.physics.arcade.enable(this.player);
        this.game.camera.follow(this.player);
        this.game.camera.setSize(400, 320);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },
    update: function() {
        this.game.physics.arcade.collide(this.player, this.blockedLayer);

        this.player.body.velocity.y = 0;
        this.player.body.velocity.x = 0;

        if (this.cursors.up.isDown)
            this.player.body.velocity.y -= 100;
        else if (this.cursors.down.isDown)
            this.player.body.velocity.y += 100;
        if (this.cursors.left.isDown)
            this.player.body.velocity.x -= 100;
        else if (this.cursors.right.isDown)
            this.player.body.velocity.x += 100;
    },
    render: function() {
        this.game.debug.cameraInfo(this.game.camera, 32, 32);
        this.game.debug.spriteCoords(this.player, 32, 128);
    }
}
