// Main - initialize Phaser game
var game = new Phaser.Game(
    400, 320,
    Phaser.AUTO,
    document.getElementById('app'),
    this, false, false
);

// Game state
game.state.add('Boot', Boot);
game.state.add('Preload', Preload);
game.state.add('Game', Game);

// Start
game.state.start('Boot');
