ChronoSpark.Preloader = function(game) {

    this.background = null;
    this.preloadBar = null;
    this.ready = false;
};

ChronoSpark.Preloader.prototype = {

    preload: function() {

        this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.logo.anchor.setTo(0.5);

        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloaderBar');
        this.preloadBar.anchor.setTo(0.5);

        // Crops the pre-load sprite as assets are loaded
        this.load.setPreloadSprite(this.preloadBar);

        // UI images
        this.load.image('bg-main', 'assets/images-game/ui-images/bg-main.jpg');
        this.load.image('ui', 'assets/images-game/ui-images/ui.png');
        this.load.image('health-bar-ui', 'assets/images-game/ui-images/health-bar-ui.png');
        this.load.image('mana-bar-ui', 'assets/images-game/ui-images/mana-bar-ui.png');
        this.load.image('exp-bar-ui', 'assets/images-game/ui-images/exp-bar-ui.png');
        this.load.image('spell-holder-ui', 'assets/images-game/ui-images/spell-holder-ui.png');
        this.load.image('text-holder-ui', 'assets/images-game/ui-images/text-holder.png');
        this.load.image('floor-holder-ui', 'assets/images-game/ui-images/floor-holder.png');
        this.load.image('fireball-icon', 'assets/images-game/ui-images/fireball-icon.png');
        this.load.image('blood-spell-icon', 'assets/images-game/ui-images/blood-spell-icon.png');
        this.load.image('plasma-spell-icon', 'assets/images-game/ui-images/plasma-spell-icon.png');
        this.load.image('light-spell-icon', 'assets/images-game/ui-images/light-spell-icon.png');
        this.load.image('heal-icon', 'assets/images-game/ui-images/heal-icon.png');
        this.load.image('mutebutton', 'assets/images-game/ui-images/mute-button.png');
        this.load.image('unmutebutton', 'assets/images-game/ui-images/unmute-button.png');
        this.load.image('instructions-button', 'assets/images-game/ui-images/instructions-button.png');

        //Shop UI images
        this.load.image('vitality-icon', 'assets/images-game/ui-images/vitality-icon.png');
        this.load.image('wisdom-icon', 'assets/images-game/ui-images/wisdom-icon.png');
        this.load.image('strength-icon', 'assets/images-game/ui-images/strength-icon.png');
        this.load.image('speed-icon', 'assets/images-game/ui-images/speed-icon.png');

        this.load.image('left-click-icon', 'assets/images-game/ui-images/left-click-icon.png');
        this.load.image('shop-background', 'assets/images-game/ui-images/shop-background.png');

        this.load.image('playButton', 'assets/images-game/ui-images/play-now-button.png');
        this.load.image('continue-fight', 'assets/images-game/ui-images/continue-fight.png');
        this.load.image('positive', 'assets/images-game/ui-images/positive.png');

        //End of UI images

		//Other non-ui game assets
        this.load.image('player-tomb', 'assets/images-game/player-tomb.png');
        this.load.image('levelParticle', 'assets/images-game/level-particle.png');
        this.load.image('spellParticle', 'assets/images-game/spell-particle.png');
        this.load.image('oracle', 'assets/images-game/oracle.png');
        this.load.image('portal', 'assets/images-game/portal.png');
        this.load.spritesheet('gold', 'assets/images-game/gold.png', 16, 16);
        this.load.spritesheet('mage-hero', 'assets/images-game/mage-hero.png', 16, 16);
        this.load.spritesheet('light-spell', 'assets/images-game/light-spell.png', 38, 38);
        this.load.spritesheet('fire-magic', 'assets/images-game/fireball-player.png', 38, 38);
        this.load.spritesheet('blood-magic', 'assets/images-game/blood-magic.png', 38, 38);
        this.load.spritesheet('tileset', 'assets/images-game/tileset.png', 16, 16);
        this.load.spritesheet('tiles', 'assets/images-game/tiles.png', 16, 16);
        this.load.spritesheet('chest', 'assets/images-game/chest.png', 16, 16);
        this.load.spritesheet('monsters', 'assets/images-game/monsters.png', 16, 16);
        this.load.spritesheet('tomb', 'assets/images-game/tomb.png', 16, 16);
        this.load.spritesheet('potions', 'assets/images-game/potions.png', 16, 16);
        this.load.spritesheet('dragon', 'assets/images-game/flying-dragon.png', 96, 64);
        this.load.spritesheet('plasma-spell', 'assets/images-game/plasmaball.png', 64, 64);
        this.load.spritesheet('sword-sprite', 'assets/images-game/sword-sprite.png', 32, 32);
        this.load.spritesheet('monsters', 'assets/images-game/monsters.png', 16, 16);

        // Loading Music

        this.load.audio('mainMenuMusic', 'assets/sound/main-menu.mp3');
        this.load.audio('mainMusic', 'assets/sound/main-music.mp3');
        this.load.audio('healAudio', 'assets/sound/heal.mp3');
        this.load.audio('attackAudio', 'assets/sound/attack.mp3');
        this.load.audio('playerAudio', 'assets/sound/player.mp3');
        this.load.audio('skeletonAudio', 'assets/sound/skeleton.mp3');
        this.load.audio('impAudio', 'assets/sound/imp.mp3');
        this.load.audio('batAudio', 'assets/sound/bat.mp3');
        this.load.audio('goblinAudio', 'assets/sound/goblin.mp3');
        this.load.audio('spiderAudio', 'assets/sound/spider.mp3');
        this.load.audio('goldAudio', 'assets/sound/gold.mp3');
        this.load.audio('potionAudio', 'assets/sound/potion.mp3');
        this.load.audio('levelUpAudio', 'assets/sound/levelling.mp3');
        this.load.audio('dragonAudio', 'assets/sound/dragon.mp3');
        this.load.audio('spellAudio', 'assets/sound/spell.mp3');
    },

    create: function() {
        // Disable cropping to allow music to load
        this.preloadBar.cropEnabled = false;
    },

    update: function() {

        // Main menu is loaded once the sound has been decoded
        if (this.cache.isSoundDecoded('mainMenuMusic') && this.ready === false) {
            this.ready = true;
            this.state.start('MainMenu');
        }
    }
};