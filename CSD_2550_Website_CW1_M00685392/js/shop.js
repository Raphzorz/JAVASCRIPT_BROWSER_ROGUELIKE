ChronoSpark.Shop = function(game) {};

ChronoSpark.Shop.prototype = {

    // Acquires the player gold and player parameters

    init: function(gold, player) {
        this.gold = gold || 0;
        maxFloor = maxFloor || 0;
        this.player = player;
    },

    create: function() {

        //Adds music
        this.music = this.add.audio('mainMenuMusic');
        this.music.loop = true;
        this.music.play();

        //Adds a background to the state
        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'shop-background', );

        // Label creation
        this.style = {
            font: "20px flipps-regular",
            fill: "#000000"
        };
        this.speedLabel = this.game.add.text(100, 430, 'Speed: ' + speed, this.style);
        this.speedLabel.fixedToCamera = true;
        this.wisdomLabel = this.game.add.text(100, 280, 'Wisdom: ' + wisdom, this.style);
        this.wisdomLabel.fixedToCamera = true;
        this.strengthLabel = this.game.add.text(100, 355, 'Strength: ' + strength, this.style);
        this.strengthLabel.fixedToCamera = true;
        this.vitalityLabel = this.game.add.text(100, 205, 'Vitality: ' + vitality, this.style);
        this.vitalityLabel.fixedToCamera = true;

        this.largerStyle = {
            font: "30px flipps-regular",
            fill: "#000000"
        };
        this.goldShopLabel = this.game.add.text(100, 105, 'Available Gold: ' + this.gold, this.largerStyle);
        this.goldShopLabel.fixedToCamera = true;
        this.smallStyle = {
            font: "10px flipps-regular",
            fill: "#000000"
        };
        this.costToUpdate = this.game.add.text(100, 485, '', this.smallStyle);
        this.costToUpdate.fixedToCamera = true;

        this.increaseSpeed = this.add.button(this.game.width - 500, this.game.height - 275, 'positive', this.incrementSpeed, this);
        this.increaseSpeed.anchor.setTo(0.5);

        this.speedIcon = this.add.image(this.game.width - 600, this.game.height - 275, 'speed-icon');
        this.speedIcon.anchor.setTo(0.5);

        this.strengthIcon = this.add.image(this.game.width - 600, this.game.height - 350, 'strength-icon');
        this.strengthIcon.anchor.setTo(0.5);

        this.increaseStrength = this.add.button(this.game.width - 500, this.game.height - 350, 'positive', this.incrementStrength, this);
        this.increaseStrength.anchor.setTo(0.5);

        this.fillerImage = this.add.image(this.game.width - 250, this.game.height - 425, 'oracle');
        this.fillerImage.anchor.setTo(0.5);

        this.wisdomIcon = this.add.image(this.game.width - 600, this.game.height - 425, 'wisdom-icon');
        this.wisdomIcon.anchor.setTo(0.5);

        this.increaseWisdom = this.add.button(this.game.width - 500, this.game.height - 425, 'positive', this.incrementWisdom, this);
        this.increaseWisdom.anchor.setTo(0.5);

        this.increaseVitality = this.add.button(this.game.width - 500, this.game.height - 500, 'positive', this.incrementVitality, this);
        this.increaseVitality.anchor.setTo(0.5);

        this.vitalityIcon = this.add.image(this.game.width - 600, this.game.height - 500, 'vitality-icon');
        this.vitalityIcon.anchor.setTo(0.5);

        this.playButton = this.add.button(this.game.width / 2 - 200, this.game.height / 2 + 220, 'continue-fight', this.startGame, this);

    },

    update: function() {
        this.showLabels(); // placed inside of the update function so as to allow it to update the stats/gold prices as they are changed
    },

    showLabels: function() {
        this.speedLabel.setText('Speed: ' + speed, this.style);
        this.wisdomLabel.setText('Wisdom: ' + wisdom, this.style);
        this.strengthLabel.setText('Strength: ' + strength, this.style);
        this.vitalityLabel.setText('Vitality: ' + vitality, this.style);
        this.goldShopLabel.setText('Available Gold: ' + Math.floor(this.gold), this.largerStyle);
        let costToUpdateText = 'Upgrade Costs \nIncrease Vitality: ' + Math.floor(goldVitalityCost) +
            ' Increase Strength: ' + Math.floor(goldStrengthCost) +
            '\nIncrease Wisdom: ' + Math.floor(goldWisdomCost) +
            ' Increase Speed: ' + Math.floor(goldSpeedCost);
        this.costToUpdate.setText(costToUpdateText, this.style);
    },

    // Increases the vitality stat if the user has enough gold
    incrementVitality: function() {
        console.log(this.gold);
        console.log(goldVitalityCost);
        if (this.gold >= goldVitalityCost) {
            ++vitality;
            console.log(this.player);
            this.gold -= goldVitalityCost;
            goldVitalityCost *= 1.2;
        }
        this.showLabels();
    },
    // Increases the strength stat if the user has enough gold
    incrementStrength: function() {
        console.log(this.gold);
        console.log(goldStrengthCost);
        if (this.gold >= goldStrengthCost) {
            ++strength;
            console.log(this.player);
            this.gold -= goldStrengthCost;
            goldStrengthCost *= 1.2;
        }
        this.showLabels();
    },
    // Increases the wisdom stat if the user has enough gold
    incrementWisdom: function() {
        console.log(this.gold);
        console.log(goldWisdomCost);
        if (this.gold >= goldWisdomCost) {
            ++wisdom;
            console.log(this.player);
            this.gold -= goldWisdomCost;
            goldWisdomCost *= 1.2;
        }
        this.showLabels();
    },
    // Increases the speed stat if the user has enough gold
    incrementSpeed: function() {
        console.log(this.gold);
        console.log(goldSpeedCost);
        if (this.gold >= goldSpeedCost) {
            ++speed;
            console.log(this.player);
            this.gold -= goldSpeedCost;
            goldSpeedCost *= 1.2;
        }
        this.showLabels();
    },

    //Continues the game from Floor1 with the current gold, xp and stats

    startGame: function() {

        this.music.stop();
        this.game.state.start('Game', true, false, this.xp + this.gold, this.player);
    },

};