ChronoSpark.MainMenu = function(game) {};

var musicState;
this.instructionsShowing = false;
ChronoSpark.MainMenu.prototype = {

    init: function() {
        // Acquires the logged in user from session storage
        this.loggedInUser = (JSON.parse(sessionStorage.getItem("LoggedInUser") || "0"));
    },

    create: function() {
        // Adds music to the main menu
        this.music = this.add.audio('mainMenuMusic');
        this.music.loop = true;
        this.music.play();
        musicState = "running";

        this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'bg-main', 0);

        // Making the background scroll
        this.background.autoScroll(-18, 0);

        this.logo = this.add.image(this.game.width / 2, this.game.height / 2, 'logo');
        this.logo.anchor.setTo(0.5);

        // Acquires the user's highest score reached

        let highScoreList = JSON.parse(localStorage.getItem("HighScoreList") || "[]");
        let i = 0;
        let found = false;
        for (i; i < highScoreList.length; ++i) {
            console.log("loop ran");
            if (highScoreList[i].username === this.loggedInUser.username) {
                maxFloor = highScoreList[i].MaxFloor;
                console.log("The player's max floor reached is:" + maxFloor);
                found = true;
                break;
            }
        }

        let text = "The highest floor you've reached so far is " + maxFloor;
        let style = {
            font: "18px pixelex",
            fill: "#626262",
            align: "center"
        };
        let welcomeStyle = {
            font: "44px pixelex",
            fill: "#626262",
            align: "center"
        };
        this.instructionsStyle = {
            font: "14px pixelex",
            fill: "#626262",
            align: "left"
        };

        // If the user has ever played the user's highest score will be displayed
        if (maxFloor > 0) {

            this.highestScore = this.game.add.text(this.game.width / 2, this.game.height - 425, text, style);
            this.highestScore.anchor.set(0.5);
        }

        // If a user is logged in the welcome back message is dislayed

        if (this.loggedInUser.username !== undefined) {
            this.hello = this.game.add.text(this.game.width / 2, this.game.height - 525, "Welcome back " + this.loggedInUser.username, welcomeStyle);
            this.hello.anchor.set(0.5);
            this.playButton = this.add.button(this.game.width / 2, this.game.height / 2 + 100, 'playButton', this.startGame, this);
            this.playButton.anchor.setTo(0.5);
        }
        // if no user is logged in the message "Please Log In To Play" will be shown
        if (this.loggedInUser.username === undefined) {

            this.hello = this.game.add.text(this.game.width / 2, this.game.height - 225, "Please Log In To Play", welcomeStyle);
            this.hello.anchor.set(0.5);


        }

        // The instructions can be toggled by clicking on the "View instructions" button

        this.instructionsText = " Use the 'WASD' keys to move the character." +
            "\n Use the 'Z' key to cast spells. " +
            "\n Aim with your cursor." +
            "\n You may cycle through spells using the 'Spacebar'. " +
            "\n Every spell has different mana costs and damage outputs." +
            "\n Hold down the left click button to use a melee attack" +
            "\n Hold down the 'Q' button to view your in game stats." +
            "\n Pressing the 'C' button will heal your character" +
            "\n Strength determines melee attacks damage," +
            "\n attack speed, splash damage and range" +
            "\n Wisdom determines mana regen, health healed by heal spell," + "\n spell damage & spell size" +
            "\n Speed determines movement and attack speed" +
            "\n Vitality determines your max health ";


        this.instructionsButton = this.add.button(this.game.width / 2, this.game.height / 2 - 325, 'instructions-button', this.showInstructions, this);
        this.instructionsButton.anchor.setTo(0.5);

        this.muteButton = this.add.button(this.game.width / 1.1 + 58, this.game.height / 2 - 360, 'unmutebutton', this.muteGame, this);
        this.muteButton.scale.set(2);
    },

    // update: function () {
    // },

    // A new background is toggled when the view instructions is clicked. The instructions are made visible

    showInstructions: function() {

        if (!this.instructionsShowing) {
            this.backgroundoverlay = this.game.add.tileSprite(128, 100, this.game.width, this.game.height, 'shop-background', 0);
            this.backgroundoverlay.scale.set(0.75);
            this.instructions = this.game.add.text(500, 340, this.instructionsText, this.instructionsStyle);
            this.instructions.anchor.set(0.5);
            this.instructionsShowing = true;
            return;
        }

        if (this.instructionsShowing) {
            this.backgroundoverlay.destroy();
            this.instructions.visible = false;
            this.instructionsShowing = false;
        }
    },

    // Toggles sound and music on or off

    muteGame: function() {

        if (musicState === "running") {
            console.log(musicState);
            this.music.pause();
            musicState = "paused";
            console.log(musicState);
            this.muteButton = this.add.button(this.game.width / 1.1 + 58, this.game.height / 2 - 360, 'mutebutton', this.muteGame, this);
            this.muteButton.scale.set(2);
        } else if (musicState === "paused") {
            this.music.resume();
            console.log("the pause us running")
            musicState = "running"
            this.muteButton = this.add.button(this.game.width / 1.1 + 58, this.game.height / 2 - 360, 'unmutebutton', this.muteGame, this);
            this.muteButton.scale.set(2);
        }
    },


    // Starts the game
    startGame: function() {
        this.music.stop();
        this.state.start('Game');
    },
};