var WebQuest = WebQuest || {};

// loading
WebQuest.Preload = function() {};

WebQuest.Preload.prototype = {
    preload: function() {
        // loading screen

        // load assets

    },
    create: function() {
        this.state.start('Game');
    }
}
