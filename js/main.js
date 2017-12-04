// Main - initialize Phaser game
var WebQuest = WebQuest || {};

WebQuest.game = new Phaser.Game(
    400, 320,
    Phaser.AUTO,
    document.getElementById('app'),
    this, false, false
);

// Game state
WebQuest.game.state.add('Boot', Boot);
WebQuest.game.state.add('Preload', Preload);
WebQuest.game.state.add('Game', Game);

// Start
WebQuest.game.state.start('Boot');
