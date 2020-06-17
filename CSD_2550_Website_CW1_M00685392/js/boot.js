// Global variables
var ChronoSpark = {};
var floorLevel;
var maxFloor;
var goldVitalityCost = 100;
var goldStrengthCost = 500;
var goldWisdomCost = 500;
var goldSpeedCost = 1000;

ChronoSpark.Boot = function(game) {

};

ChronoSpark.Boot.prototype = {

    init: function() {
        this.game.add.text(0, 0, "hack", {
            font: "1px flipps-regular",
            fill: "#FFFFFF"
        });
        this.game.renderer.renderSession.roundPixels = true; // helps with pixel art rendering
        floorLevel = 1;
        maxFloor = 0;
        this.input.maxPointers = 1;

        this.stage.disableVisibilityChange = true;

    },

    preload: function() {
        this.game.add.text(0, 0, "hack", {
            font: "1px Flipps-Regular",
            fill: "#FFFFFF"
        });
        this.game.add.text(0, 0, "hack", {
            font: "1px pixelex",
            fill: "#FFFFFF"
        });
        // The game logo and a pre-loader bar are loaded
        this.load.image('logo', 'assets/images-game/ui-images/chrono-spark-logo.png');
        this.load.image('preloaderBar', 'assets/images-game/ui-images/preload-bar.png');
    },

    create: function() {

        //These must be done so as to be able to use the custom fonts
        this.game.add.text(0, 0, "hack", {
            font: "1px flipps-regular",
            fill: "#FFFFFF"
        });
        this.game.add.text(0, 0, "hack", {
            font: "1px pixelex",
            fill: "#FFFFFF"
        });
        // The actual preloader is launched
        this.state.start('Preloader');
    }
};