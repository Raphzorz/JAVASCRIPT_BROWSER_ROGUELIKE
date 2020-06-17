// The Chronospark object is created as a blank array if it does not already exist.
var ChronoSpark = ChronoSpark || {};

// The dimensions of the game are defined. The ID of the container is given.
ChronoSpark.game = new Phaser.Game(1024, 722, Phaser.AUTO, 'game-container', null, false, false);

ChronoSpark.game.state.add('Boot', ChronoSpark.Boot);
ChronoSpark.game.state.add('Preloader', ChronoSpark.Preloader);
ChronoSpark.game.state.add('MainMenu', ChronoSpark.MainMenu);
ChronoSpark.game.state.add('Game', ChronoSpark.Game);
ChronoSpark.game.state.add('Shop', ChronoSpark.Shop);
ChronoSpark.game.state.start('Boot');