var WebQuest = WebQuest || {};

// title
WebQuest.Game = function() {};

WebQuest.Game.prototype = {
    create: function() {
        this.map = this.game.add.tilemap('map1');

        this.map.addTilesetImage('tiles', 'gameTiles');

        this.backgroundLayer = this.map.createLayer('backgroundLayer');
        this.foregroundLayer = this.map.createLayer('foregroundLayer');
        this.blockedLayer = this.map.createLayer('blockedLayer');

        this.map.setCollisionBetween(1, 2000, true, 'blockedLayer');

        this.backgroundLayer.resizeWorld();

        console.log(this.map);
    }
}
