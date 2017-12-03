// Main - initialize Phaser game
var WebQuest = WebQuest || {};

WebQuest.game = new Phaser.Game(
    400, 320,
    Phaser.AUTO,
    document.getElementById('app'),
    this, false, false
);

// Game state
WebQuest.game.state.add('Boot', WebQuest.Boot);
WebQuest.game.state.add('Preload', WebQuest.Preload);
WebQuest.game.state.add('Game', WebQuest.Game);

// Start
WebQuest.game.state.start('Boot');
