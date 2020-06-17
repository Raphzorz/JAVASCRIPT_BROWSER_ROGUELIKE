var vitality = 300;
var speed = 120;
var strength = 25;
var wisdom = 25;
ChronoSpark.Game = function(game) {

    this.notification = '';
    this.spellManaCost = 20; // Necessary or the first spell press will not work
    this.spellDamageMultiplier = 2; // Necessary or the first spell press will not work
    this.healManaCost = 50;
    this.gold = 0;
    this.xp = 0;
    this.xpToNext = 20; // Necessary or the player will not gain xp
    this.playerlevel = 1;
    this.playerhealth = 300;
    this.playerMana = 200;
    this.maxPlayerMana = 200;
    this.index = 1;
    this.unlockedSpells = ['light-spell', 'plasma-spell', 'blood-magic', 'fire-magic'];
    this.buttonPressed = false;
    this.selectedSpellName;
    this.healthStatus;

};
var map;
var layer;
this.continueMusic = false;
ChronoSpark.Game.prototype = {

    init: function(score, player) {
        var score = score || 0;
        this.highestScore = this.highestScore || 0;
        this.highestScore = Math.max(score, this.highestScore);
        this.player = player;
        this.dragonSpawned = false;
    },

    // Anything inside of the create  is running once on initialisation of the state
    create: function() {
        console.log("player is currently on floor " + floorLevel);
        var worldSize = 1920;
        this.game.world.setBounds(0, 0, worldSize, worldSize);
        var overlandTileset;
        let rnd = Math.random();
        /// A different tileset will be used depending on the random number created
        if (rnd >= 0 && rnd < .2) overlandTileset = 0; // Forest
        else if (rnd >= .2 && rnd < .4) overlandTileset = 4; // Desert
        else if (rnd >= .4 && rnd < .6) overlandTileset = 8; // Snow
        else if (rnd >= .6 && rnd < .7) overlandTileset = 12; // Wastelands
        else if (rnd >= .7 && rnd < .8) overlandTileset = 21; // Earth
        else if (rnd >= .8 && rnd < .10) overlandTileset = 25; // Cracked desert
        this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'tileset', overlandTileset);
        this.createGrid(worldSize);
        // there is a 30% chance of it starting to rain during the creation of the map
        let raining = Math.random();
        if (raining >= 0 && raining < .3) {
            this.isRaining();
        }

        //The below emitter is called whenever an enemy is hit by a spell. It is created here to avoid having to create it multiple times
        //in the update method

        this.emitterExplode = this.game.add.emitter(0, 0, 300);
        this.emitterExplode.makeParticles('spellParticle');
        this.emitterExplode.minParticleSpeed.setTo(-2000, -2000);
        this.emitterExplode.maxParticleSpeed.setTo(2000, 2000);
        this.emitterExplode.gravity = 0;
        console.log(this.emitterExplode);


        // Initialize data
        this.spellCooldown = 0;


        // create the portals which transport the player from one stage to the next
        this.createPortals();
        //creates trees and such
        this.createGreenery();
        //create chests and potions
        this.createPickUps();

        this.corpses = this.game.add.group();

        // The player is created
        this.player = this.createPlayer();
        // The camera is set to follow the player
        this.game.camera.follow(this.player);

        this.playerAttacks = this.createAttacks('sword-sprite', 1);
        this.playerSpells = this.createAttacks('light-spell', 10);

        // 100 enemies are spawned randomly
        this.createEnemies(100);

        // create a dragon group
        this.overPoweredDragon = this.game.add.group();
        this.overPoweredDragon.enableBody = true;
        this.overPoweredDragon.physicsBodyType = Phaser.Physics.ARCADE;

        // Music
        //continueMusic is true whenever a player moves from one floor to the next. This statement is necessary to prevent
        //two songs from playing over each other
        if (!this.continueMusic) {
            this.music = this.game.add.audio('mainMusic');
            this.music.loop = true;
            this.music.play()
        }

        //If the player paused the music previously and has not yet unpaused it then the music will be paused

        if (musicState === "paused") {
            console.log("Music state is" + musicState);
            this.music.pause();
        }

        // Audio effects are created
        this.createAudio();

        // The controls are defined
        this.controls = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
            spell: this.game.input.keyboard.addKey(Phaser.Keyboard.Z),
            showStats: this.game.input.keyboard.addKey(Phaser.Keyboard.Q),
            spellRotation: this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
            heal: this.game.input.keyboard.addKey(Phaser.Keyboard.C),
        };

        // The UI is set up
        this.showLabels();
    },

    // functions inside of update run all the time
    update: function() {

        this.playerHandler();
        this.enemyHandler();
        this.dragonHandler();
        this.collisionHandler();
        this.playerSpellSelector();
        this.playerShowStats();
        this.statusBarTracker();
        this.pickUps.forEachDead(function(collectible) {
            collectible.destroy();
        });

        this.notificationLabel.text = this.notification;
        this.xpLabel.text = 'Lvl. ' + this.player.level; 
        this.goldLabel.text = this.gold + ' Gold'; // Shows the amount of gold the player has
        this.healthLabel.text = Math.floor(this.player.health) + ' / ' + vitality;
        this.floorLabel.text = 'Currently on floor: ' + floorLevel;
        this.manaLabel.text = Math.floor(this.playerMana) + ' / ' + this.maxPlayerMana;
        if (this.playerMana < this.maxPlayerMana) {

            this.playerMana += (0.003 * wisdom); // This is responsible for the player's mana regeneration
        }
    },

    // The code responsible for creating rain
    isRaining() {
        let rainParticle = this.game.add.bitmapData(15, 50);

        rainParticle.ctx.rect(0, 0, 15, 50);
        rainParticle.ctx.fillStyle = '#9cc9de';
        rainParticle.ctx.fill();

        this.emitter = this.game.add.emitter(this.game.world.centerX, -300, 400);

        this.emitter.width = this.game.world.width;
        this.emitter.angle = 10;

        this.emitter.makeParticles(rainParticle);

        this.emitter.minParticleScale = 0.1;
        this.emitter.maxParticleScale = 0.3;

        this.emitter.setYSpeed(600, 1000);
        this.emitter.setXSpeed(-5, 5);

        this.emitter.minRotation = 0;
        this.emitter.maxRotation = 0;

        this.emitter.start(false, 1600, 5, 0);
    },

    playerHandler: function() {

        if (this.player.alive) {

            //The players movements are coded in the below function. Animations, movement speed...etc.
            this.playerMovementHandler();


            // The player's melee attack. Attack speed is determined by speed while the AOE affect is determined by strength
            if (this.game.input.activePointer.isDown) {
                this.playerAttacks.rate = 1000 - (speed * 4);
                if (this.playerAttacks.rate < 200) {
                    this.playerAttacks.rate = 200;
                }
                this.playerAttacks.range = strength * 4;
                this.attack(this.player, this.playerAttacks);
            }


            // Use spell when Z is pressed as long as the spell is not on cool down and the player has more mana than the spell costs
            if ((this.playerMana > this.spellManaCost) && (this.controls.spell.isDown) && (this.game.time.now > this.spellCooldown)) {
                this.playerSpells.rate = 2000; /// The time that the spell will be active before it is destroyed.
                this.playerSpells.range = wisdom * 10; // The speed at which the projectile/spell travels at
                this.attack(this.player, this.playerSpells); // The attack function is called
                this.playerMana -= this.spellManaCost; // The mana requirements are subtracted from the player's mana
                this.spellCooldown = this.game.time.now + 2000; // A cooldown of 2s is applied after a spell is cast
            }


            // The player's heal spell (pressing C). Wisdom affects the amount of health healed
            if ((this.playerMana > this.healManaCost) && (this.controls.heal.isDown) && (this.game.time.now > this.spellCooldown)) {
                this.playerMana -= this.healManaCost;
                this.spellCooldown = this.game.time.now + 2000;
                this.player.health += (10 * wisdom);
                this.notification += '\n' + this.player.name + 'has healed for ' + (10 * wisdom);
                this.healAudio.play();
            }

            // The player's health can never go higher than max vitality
            if (this.player.health > vitality) {
                this.player.health = vitality;
            }

            // If xp is higher than xp required to level up then the level up function is called
            if (this.xp >= this.xpToNext) {
                this.levelUp();
            }
        }

        //If the player dies then a tombstone is added, a camera fade of 3s after which the gameOver function is called
        if (!this.player.alive) {
            let ripInPepperoni = this.game.add.sprite(this.player.x, this.player.y, 'player-tomb');
            ripInPepperoni.scale.setTo(1.5);
            this.game.camera.fade(0x000000, 3000);
            this.state.game.time.events.add(3000, this.gameOver, this);

        }
    },

    enemyHandler: function() {

        // Every alive enemy will move towards the player
        this.enemies.forEachAlive(function(enemy) {
            if (enemy.visible && enemy.inCamera) {
                this.game.physics.arcade.moveToObject(enemy, this.player, enemy.speed);
                this.enemyMovementHandler(enemy);
            }
        }, this);

        // Either gold or potions are dropped by a dead enemy. This is done by calling the random number generator function.
        this.enemies.forEachDead(function(enemy) {
            if (this.rng(0, 5)) {
                this.createGold(enemy);
            } else if (this.rng(0, 9)) {
                this.createPotion(enemy);
                this.notification += '\nThe ' + enemy.name + ' dropped a potion!';
            }
            // The enemy's xp is added to the player exp
            this.xp += enemy.expGain;
            //A new enemy is created when one dies
            this.createEnemy(this.enemies);
            this.deathHandler(enemy);
        }, this);
    },

    dragonHandler: function() {

        // Spawn dragon every 5th floor
        if ((floorLevel % 5 === 0) && !this.dragonSpawned) {
            this.dragonSpawned = true;
            dragon = this.createDragon();
            this.dragonAudio.play();
            this.notification += '\nA dragon appeared!';
        }

        this.overPoweredDragon.forEachAlive(function(dragon) {
            if (dragon.visible && dragon.inCamera) {
                this.game.physics.arcade.moveToObject(dragon, this.player, dragon.speed);
                this.enemyMovementHandler(dragon);
            }
        }, this);

        this.overPoweredDragon.forEachDead(function(dragon) {

            this.createGold(dragon);
            this.createGoldChest(dragon);
            this.createVitalityPotion(dragon);
            this.createStrengthPotion(dragon);
            this.createWisdomPotion(dragon);
            this.createSpeedPotion(dragon);
            this.notification += '\nThe ' + dragon.name + ' dropped a lot of potions!';
            this.xp += dragon.expGain;

            let emitter = this.game.add.emitter(dragon.x, dragon.y, 100);
            emitter.makeParticles('levelParticle');
            emitter.minParticleSpeed.setTo(-200, -200);
            emitter.maxParticleSpeed.setTo(200, 200);
            emitter.gravity = 0;
            emitter.start(true, 1000, null, 100);

            dragon.destroy();

        }, this);
    },

    collisionHandler: function() {

        this.game.physics.arcade.collide(this.player, this.enemies, this.hit, null, this);
        this.game.physics.arcade.collide(this.player, this.overPoweredDragon, this.hit, null, this);

        this.game.physics.arcade.collide(this.overPoweredDragon, this.playerAttacks, this.hit, null, this);
        this.game.physics.arcade.collide(this.enemies, this.playerAttacks, this.hit, null, this);
        this.game.physics.arcade.overlap(this.overPoweredDragon, this.playerAttacks, this.hit, null, this);
        this.game.physics.arcade.overlap(this.enemies, this.playerAttacks, this.hit, null, this);

        this.game.physics.arcade.overlap(this.overPoweredDragon, this.playerSpells, this.hit, null, this);
        this.game.physics.arcade.overlap(this.enemies, this.playerSpells, this.hit, null, this);

        this.game.physics.arcade.collide(this.greenery, this.player, null, null, this);
        this.game.physics.arcade.collide(this.greenery, this.playerAttacks, null, null, this);
        this.game.physics.arcade.collide(this.greenery, this.enemies, null, null, this);
        this.game.physics.arcade.collide(this.portals, this.enemies, null, null, this);
        this.game.physics.arcade.collide(this.portals, this.greenery, null, null, this);

        this.game.physics.arcade.overlap(this.pickUps, this.player, this.collect, null, this);
        this.game.physics.arcade.overlap(this.portals, this.player, this.goToNextLevel, null, this);
    },

    showLabels: function() {

        // The UI is created
        let text = '';
        const uiStyle = {
            font: '10px pixelex',
            fill: '#000000',
            align: 'center'
        };

        this.ui = this.game.add.image(25, this.game.height - 99, 'ui');
        this.ui.fixedToCamera = true;

        this.spellHolder = this.game.add.image(255, this.game.height - 80, 'spell-holder-ui');
        this.spellHolder.fixedToCamera = true;

        this.spellHolderIcon = this.game.add.image(337, this.game.height - 67, 'light-spell-icon');
        this.spellHolderIcon.fixedToCamera = true;
        this.attkHolderText = this.game.add.text(15, this.game.height - 722, "WASD: Move, Q: Showstats, LeftClick: Melee attack, Z: Cast selected spell, Spacebar: Cycle spell, C: Heal spell", uiStyle);
        this.attkHolderText.fixedToCamera = true;

        this.uiLeftClick = this.game.add.image(287, this.game.height - 67, 'left-click-icon');
        this.uiLeftClick.fixedToCamera = true;

        this.uiHealIcon = this.game.add.image(387, this.game.height - 67, 'heal-icon');
        this.uiHealIcon.fixedToCamera = true;

        this.floorHolder = this.game.add.image(30, this.game.height - 720, 'floor-holder-ui');
        this.floorHolder.fixedToCamera = true;

        this.textHolder = this.game.add.image(700, this.game.height - 200, 'text-holder-ui');
        this.textHolder.fixedToCamera = true;

      let   style = {
            font: '7px Flipps-Regular',
            fill: '#000000',
            align: 'left'
        };
        this.notificationLabel = this.game.add.text(730, 550, text, style);
        this.notificationLabel.fixedToCamera = true;

        this.healthUi = this.game.add.image(101, this.game.height - 85.5, 'health-bar-ui');
        this.healthUi.fixedToCamera = true;

        const levelStyle = {
            font: '18px Flipps-Regular',
            fill: '#ffcc11',
            align: 'center'
        };
        this.levelUI = this.game.add.text(65, 652, this.player.level, levelStyle);
        this.levelUI.fixedToCamera = true;

        this.manaUi = this.game.add.image(104, this.game.height - 44, 'mana-bar-ui');
        this.manaUi.fixedToCamera = true;

        this.expUi = this.game.add.image(103, this.game.height - 63.5, 'exp-bar-ui');
        this.expUi.fixedToCamera = true;

        if (musicState === "running") {
            this.muteButton = this.add.button(this.game.width / 1.1 + 61, this.game.height / 2 - 360, 'unmutebutton', this.muteGame, this);
            this.muteButton.fixedToCamera = true;
            this.muteButton.scale.set(2);
        } else {
            this.muteButton = this.add.button(this.game.width / 1.1 + 61, this.game.height / 2 - 360, 'mutebutton', this.muteGame, this);
            this.muteButton.fixedToCamera = true;
            this.muteButton.scale.set(2);
        }

            style = {
            font: '10px Arial',
            fill: '#ffffff',
            align: 'center'
        };
        this.healthLabel = this.game.add.text(145, this.game.height - 77, text, style);
        this.healthLabel.fixedToCamera = true;

        style = {
            font: '10px Arial',
            fill: '#ffffff',
            align: 'center'
        };
        this.manaLabel = this.game.add.text(145, this.game.height - 38, text, style);
        this.manaLabel.fixedToCamera = true;

        style = {
            font: '10px Arial',
            fill: '#ffffff',
            align: 'center'
        };
        this.xpLabel = this.game.add.text(145, this.game.height - 58, text, style);
        this.xpLabel.fixedToCamera = true;

        let Coolstyle = {
            font: '10px Flipps-Regular',
            fill: '#000000',
            align: 'center'
        };
        this.floorLabel = this.game.add.text(100, 50, text, Coolstyle);
        this.floorLabel.fixedToCamera = true;

        this.goldLabel = this.game.add.text(this.game.width - 275, this.game.height - 170, text, Coolstyle);
        this.goldLabel.fixedToCamera = true;
    },

    levelUp: function() {

        // Player stats are incremented whenever the player levels up
        this.player.level++;
        this.playerlevel++;
        vitality += 5;
        this.player.health = vitality;
        this.playerhealth += 5;
        this.player.strength += 2;
        this.player.vitality += 5;
        strength += 2;
        wisdom += 2;
        speed += 1;
        this.playerMana = this.maxPlayerMana;
        this.xp -= this.xpToNext;
        this.xpToNext = Math.floor(this.player.level * 2 * 10);
        this.notification += '\n' + this.player.name + ' has advanced to level ' + this.player.level + '!';
        this.levelUpAudio.play();

        // Adding the level up pop up text
        const levelUpStyle = {
            font: '17px flipps-regular',
            fill: '#ffcc11',
            align: 'center'
        };
        this.textToRemove = this.game.add.text(this.game.width / 2 - 180, this.game.height / 2 - 130, 'You have reached level ' + this.playerlevel, levelUpStyle);
        this.textToRemove.fixedToCamera = true;
        this.game.time.events.add(1000, function() {
            this.game.add.tween(this.textToRemove).to({
                alpha: 0
            }, 1500, Phaser.Easing.Linear.None, true);
        }, this);
        //Making the player "explode" with particles when he levels up
        let emitter = this.game.add.emitter(this.player.x, this.player.y, 300);
        emitter.makeParticles('levelParticle');
        emitter.minParticleSpeed.setTo(-2000, -2000);
        emitter.maxParticleSpeed.setTo(2000, 2000);
        emitter.gravity = 0;
        emitter.start(true, 1000, null, 100);
    },

    attack: function(attacker, attacks) {

        if (attacker.alive && this.game.time.now > attacks.next && attacks.countDead() > 0) {
            attacks.next = this.game.time.now + attacks.rate;
            let a = attacks.getFirstDead();
            // Spells are scaled according to wisdom
            let spellSize = (wisdom * 0.025);
            if (spellSize > 3.5) {
                spellSize = 3.5
            } // Ensures that spells do not get too large and cause lag
            a.scale.setTo(spellSize);
            a.name = attacker.name;
            let dmgRandomiser = Math.random() * (1.2 - 0.8) + 0.8; /// This gives the damage a bit of variance. Between 0.8 and 1.2 *
            a.strength = attacker.strength * dmgRandomiser;
            a.reset(attacker.x + 16, attacker.y + 16);
            a.lifespan = attacks.rate;
            console.log(attacker.name + " used " + attacks.name + "!");
            if (attacks.name === 'sword-sprite') {
                // melee attacks will point towards the pointer
                a.rotation = this.game.physics.arcade.moveToPointer(a, attacks.range);
                this.attackAudio.play();
            } else if (attacks.name === 'light-spell' || 'plasma-spell' || 'blood-magic' || 'fire-magic') {
                a.effect = 'boom';
                // An element of rng is added to the spell damage
                a.strength = (attacker.wisdom * dmgRandomiser) * this.spellDamageMultiplier;
                a.rotation = this.game.physics.arcade.moveToPointer(a, attacks.range);
                this.spellAudio.play();
            } else {
                a.effect = null
            }
        }

    },

    createAttacks: function(name, amount, rate, range) {

        // create the group of attack objects
        var attacks = this.game.add.group();
        attacks.enableBody = true;
        attacks.physicsBodyType = Phaser.Physics.ARCADE;
        attacks.createMultiple(amount, name);
        // Animations are added to the spells and called
        if (name === 'light-spell' || 'plasma-spell' || 'blood-magic' || 'fire-magic') {
            attacks.callAll('animations.add', 'animations', 'particle', [0, 1, 2, 3], 8, true);
            attacks.callAll('animations.play', 'animations', 'particle');
            // The dragon's attack
        }
        // The melee attack
        else if (name === 'sword-sprite') {
            attacks.callAll('animations.add', 'animations', 'particle', [0, 1, 2, 3, 4], 60, true);
            attacks.callAll('animations.play', 'animations', 'particle');
        }
        attacks.setAll('anchor.x', 0.5);
        attacks.setAll('anchor.y', 0.5);
        //Attacks will disappear whenever they go out of bounds
        attacks.setAll('outOfBoundsKill', true);
        attacks.setAll('checkWorldBounds', true);

        attacks.rate = rate;
        attacks.range = range;
        attacks.next = 0;
        attacks.name = name;
        return attacks;
    },

    hit: function(target, attacker) {

        if (this.game.time.now > target.invincibilityTime) {
            // This is to prevent too many attacks within the same second
            target.invincibilityTime = this.game.time.now + target.invincibilityFrames;
            target.damage(attacker.strength);
            // If a target's hp drops below 0 they will die
            if (target.health < 0) {
                target.health = 0;
                target.alive = false;
            }
            this.playAudio(target.name);
            const styleDamage = {
                font: '17px flipps-regular',
                fill: '#7f0a16',
                align: 'center'
            };
            // Responsible for creating a pop up of text above the enemy/player on damage
            let textToRemove;
            textToRemove = this.game.add.text(target.x, target.y - 20, Math.floor(attacker.strength), styleDamage);
            this.toolTip(target, textToRemove);

            if (attacker.effect === 'boom') {
                console.log(this.playerSpells);
            // If a spell hits an enemy the emitter inside of the create method will be called
                this.emitterExplode.x = attacker.x;
                this.emitterExplode.y = attacker.y;
                this.emitterExplode.start(true, 100, null, 300);
            }
        }
    },

    // This adds a tooltip effect which slowly goes towards the top of the screen and fades away. It shows the damage received by the player or enemy
    // Or the gold received from a chest

    toolTip: function(target, textToRemove) {
        this.game.time.events.add(1000, function() {
            this.game.add.tween(textToRemove).to({
                y: target.y - 50
            }, 1000, Phaser.Easing.Linear.None, true);
            this.game.add.tween(textToRemove).to({
                alpha: 0
            }, 1500, Phaser.Easing.Linear.None, true);
        }, this);
    },

    deathHandler: function(target) {

        // A tomb will appear for 3 seconds upon death of an enemy
        var corpse = this.corpses.create(target.x, target.y, 'tomb');
        corpse.scale.setTo(1.2);
        corpse.animations.add('idle', [target.corpseSprite], 139, true);
        corpse.animations.play('idle');
        corpse.lifespan = 3000;
        target.destroy();
    },

    // When a player touches a portal the camera will fade for 1 seconds and the player will spawn in a new floor
    goToNextLevel: function(player, portal) {
        this.game.camera.fade(0x000000, 1000);
        this.camera.onFadeComplete.add(this.fadeComplete, this);
    },

    fadeComplete: function() {
        ++floorLevel;
        this.continueMusic = true;
        this.state.start('Game');
        this.notification += ' \nThe portal sends you to the next stage. \nA magical power fully heals your HP';
    },


    // This function runs whenever a player overlaps a collectible item

    collect: function(player, collectible) {

        if (!collectible.collected) {
            collectible.collected = true;
            let goldGain;
            if (collectible.name === 'gold') {
                Gain = floorLevel + Math.floor(Math.random() * 10000);
                this.gold += collectible.value;
                this.goldAudio.play();
                this.notification += '\nYou pick up ' + collectible.value + ' gold.';
                collectible.destroy();
            } else if (collectible.name === 'chest') {
                collectible.animations.play('open');
                this.gold += collectible.value;
                this.goldAudio.play();
                this.notification += '\nYou open the chest and find ' + collectible.value + ' gold!';

                const styleChest = {
                    font: '15px flipps-regular',
                    fill: '#ffde03',
                    align: 'center'
                };
                let textToRemove = this.game.add.text(collectible.x - 5, collectible.y - 30, collectible.value, styleChest);
                this.toolTip(collectible, textToRemove);
                collectible.lifespan = 1000;

                // Potions increase player stats permanently
            } else if (collectible.name === 'healthPotion') {
                this.player.health += collectible.value;
                this.notification += '\nYou consume a potion,\nhealing you for ' + collectible.value + ' health.';
                this.potionAudio.play();
                collectible.destroy();
            } else if (collectible.name === 'vitalityPotion') {
                vitality += collectible.value;
                this.player.vitality += collectible.value;
                this.notification += '\nYou consume a potion,\nincreasing your vitality by ' + collectible.value + '!';
                this.potionAudio.play();
                collectible.destroy();
            } else if (collectible.name === 'strengthPotion') {
                strength += collectible.value;
                this.player.strength += collectible.value;
                this.notification += '\nYou consume a potion,\nincreasing your strength by ' + collectible.value + '!';
                this.potionAudio.play();
                collectible.destroy();
            } else if (collectible.name === 'speedPotion') {
                speed += collectible.value;
                this.player.speed += collectible.value;
                this.notification += '\nYou consume a potion,\nincreasing your speed by  ' + collectible.value + '!';
                this.potionAudio.play();
                collectible.destroy();
            } else if (collectible.name === 'wisdomPotion') {
                wisdom += collectible.value;
                this.player.wisdom += collectible.value;
                this.notification += '\nYou consume a potion,\nincreasing your wisdom by  ' + collectible.value + '!';
                this.potionAudio.play();
                collectible.destroy();
            }
        } else if (collectible.name === 'manaPotion') {
            this.player.playerMana += collectible.value;
            this.notification += '\nYou consume a potion,\nincreasing your mana by  ' + collectible.value + '!';
            this.potionAudio.play();
            collectible.destroy();
        }
    },

    createPlayer: function() {

        // create the player
        var player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'mage-hero');

        //Animations are added to the player sprite
        player.animations.add('down', [0, 1, 2, 3], 10, true);
        player.animations.add('left', [4, 5, 6, 7], 10, true);
        player.animations.add('right', [8, 9, 10, 11], 10, true);
        player.animations.add('up', [12, 13, 14, 15], 10, true);
        player.animations.play('down');
        player.scale.setTo(2);

        // Create the physics and set the player to alive
        this.game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.alive = true;
        //The player's name used in notifications will be equivalent to the logged in user's name
        this.loggedInUser = (JSON.parse(sessionStorage.getItem("LoggedInUser") || "0"));
        player.name = this.loggedInUser.username;
        player.level = this.playerlevel;
        player.health = this.playerhealth;
        player.vitality = vitality;
        player.strength = strength;
        player.wisdom = wisdom;
        player.speed = speed;
        player.invincibilityFrames = 500; // The player will not be able to get hit for 1/2 a second after getting hit
        player.invincibilityTime = 0;
        player.corpseSprite = 136; // The tomb used for the player's death
        return player;
    },

    setStats: function(creature, name, health, speed, strength, expGain, corpseSprite) {

        // Creature physics are defined
        creature.animations.play('down');
        creature.scale.setTo(2);

        creature.body.collideWorldBounds = true;
        creature.body.velocity.x = 0,
            creature.body.velocity.y = 0,
            creature.alive = true;

        //Creature stats are set
        creature.name = name;
        creature.level = floorLevel + 2;
        creature.health = health + (creature.level * 3);
        creature.speed = speed + Math.floor(creature.level * 1.2);
        creature.strength = strength + Math.floor(creature.level * 1.75);
        creature.expGain = expGain + Math.floor(creature.level * 1.75);
        creature.invincibilityFrames = 300;
        creature.invincibilityTime = 0;
        creature.corpseSprite = corpseSprite;

        return creature;
    },

    createEnemies: function(amount) {

        // This is called and amount (100 in this case) is passed to the function. 100 enemies are created
        this.enemies = this.game.add.group();

        // Enable physics in them
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

        for (let i = 0; i < amount; i++) {
            this.createEnemy();
        }
    },

    // This function is called 100 times at the start of the game
    createEnemy: function() {

        var enemy = this.enemies.create(this.game.world.randomX, this.game.world.randomY, 'monsters');

        do {
            enemy.reset(this.game.world.randomX, this.game.world.randomY);
        } while (Phaser.Math.distance(this.player.x, this.player.y, enemy.x, enemy.y) <= 100);

        //The random number generator is used to determine how many creatures of each type spawn
        let rnd = Math.random();
        if (rnd >= 0 && rnd < .3) enemy = this.createSkeleton(enemy);
        else if (rnd >= .3 && rnd < .4) enemy = this.createGoblin(enemy);
        else if (rnd >= .4 && rnd < .6) enemy = this.createBat(enemy);
        else if (rnd >= .6 && rnd < .7) enemy = this.createImp(enemy);
        else if (rnd >= .7 && rnd < 1) enemy = this.createSpider(enemy);

        //console.log('created ' + enemy.name + ' with ' + enemy.health + ' health, ' + enemy.strength + ' strength, and ' + enemy.speed + ' speed.');

        return enemy;
    },

    // Animations are assigned to each enemy. Base stats are set which are later modified according to what floor the player is on
    createSkeleton: function(enemy) {

        enemy.animations.add('down', [9, 10, 11], 10, true);
        enemy.animations.add('left', [21, 22, 23], 10, true);
        enemy.animations.add('right', [33, 34, 35], 10, true);
        enemy.animations.add('up', [45, 46, 47], 10, true);

        return this.setStats(enemy, 'Skeleton', 100, 18, 20, 5, 139); // (creature, name, health, speed, strength, expGain, corpseSprite)
    },

    createImp: function(enemy) {

        enemy.animations.add('down', [156, 157, 158, 159], 10, true);
        enemy.animations.add('left', [168, 169, 170, 171], 10, true);
        enemy.animations.add('right', [192, 193, 194, 195], 10, true);
        enemy.animations.add('up', [180, 181, 182, 183], 10, true);

        return this.setStats(enemy, 'Imp', 150, 15, 30, 8, 139);
    },

    createBat: function(enemy) {

        enemy.animations.add('down', [51, 52, 53], 10, true);
        enemy.animations.add('left', [63, 64, 65], 10, true);
        enemy.animations.add('right', [75, 76, 77], 10, true);
        enemy.animations.add('up', [87, 88, 89], 10, true);

        return this.setStats(enemy, 'Bat', 20, 22, 12, 2, 139);
    },

    createGoblin: function(enemy) {

        enemy.animations.add('down', [96, 97, 98, 99, 100], 10, true);
        enemy.animations.add('left', [132, 133, 134, 135], 10, true);
        enemy.animations.add('right', [108, 109, 110, 111], 10, true);
        enemy.animations.add('up', [120, 121, 122, 123], 10, true);

        return this.setStats(enemy, 'Goblin', 200, 18, 40, 9, 139);
    },

    createSpider: function(enemy) {

        enemy.animations.add('down', [277, 276, 277, 278], 10, true);
        enemy.animations.add('left', [265, 266, 267, 268], 10, true);
        enemy.animations.add('right', [289, 290, 291, 292], 10, true);
        enemy.animations.add('up', [253, 254, 255, 256], 10, true);

        return this.setStats(enemy, 'Spider', 60, 21, 12, 4, 139);
    },

    createDragon: function() {

        let dragon = this.overPoweredDragon.create(this.player.x, this.player.y - 300, 'dragon');

        dragon.animations.add('down', [0, 1, 2], 10, true);
        dragon.animations.add('left', [3, 4, 5], 10, true);
        dragon.animations.add('right', [6, 7, 8], 10, true);
        dragon.animations.add('up', [9, 10, 11], 10, true);

        console.log('spawned a dragon!');

        return this.setStats(dragon, 'Dragon', 1000, 70, 50, 35, 139);
    },

    createGreenery: function() {

        // 390 trees & assorted are created
        const amount = 390;
        this.greenery = this.game.add.group();
        this.greenery.enableBody = true;

        for (let i = 0; i < amount; i++) {
            let point = this.getRandomLocation();
            let spriteIndex = Math.floor(Math.random() * 10);
            this.createLotsOfGreenery(point, spriteIndex);
        }
    },

    // Two portals are created and randomly placed inside of the map
    createPortals: function() {

        this.portals = this.game.add.group();
        this.portals.enableBody = true;
        const amount = 2;
        for (let i = 0; i < amount; i++) {
            let point = this.getRandomLocation();
            this.createPortal(point);
        }
    },

    createPortal: function(location) {

        // Portal physics are created
        let portal = this.portals.create(location.x, location.y, 'portal');
        portal.scale.setTo(1);
        portal.body.setSize(32, 32);
        portal.body.moves = false;
        return portal;

    },

    createLotsOfGreenery: function(location, spriteIndex) {

        let greenery = this.greenery.create(location.x, location.y, 'tiles');

        switch (spriteIndex) {
            case 0:
                greenery.animations.add('tree', [38], 0, true);
                greenery.animations.play('tree');
                break;
            case 1:
                greenery.animations.add('tree', [38], 0, true);
                greenery.animations.play('tree');
                break;
            case 2:
                greenery.animations.add('shrub', [20], 0, true);
                greenery.animations.play('shrub');
                break;
            case 3:
                greenery.animations.add('pine', [30], 0, true);
                greenery.animations.play('pine');
                break;
            case 4:
                greenery.animations.add('tree', [38], 0, true);
                greenery.animations.play('tree');
                break;
            case 5:
                greenery.animations.add('pine', [30], 0, true);
                greenery.animations.play('pine');
                break;
            case 6:
                greenery.animations.add('tree', [76], 0, true);
                greenery.animations.play('tree');
                break;
            case 7:
                greenery.animations.add('tree', [77], 0, true);
                greenery.animations.play('tree');
                break;
            case 8:
                greenery.animations.add('tree', [38], 0, true);
                greenery.animations.play('tree');
                break;
            case 9:
                greenery.animations.add('tree', [38], 0, true);
                greenery.animations.play('tree');
                break;
        }

        greenery.scale.setTo(2.5);
        greenery.body.setSize(10, 10);
        greenery.body.moves = false;
        return greenery;
    },

    createPickUps: function() {

        this.pickUps = this.game.add.group();
        this.pickUps.enableBody = true;
        this.pickUps.physicsBodyType = Phaser.Physics.ARCADE;

        const amount = 20;
        for (let i = 0; i < amount; i++) {
            let point = this.getRandomLocation();
            this.createGoldChest(point);
        }
    },

    createGoldChest: function(location) {

        let collectible = this.pickUps.create(location.x, location.y, 'chest');
        collectible.scale.setTo(1.2);
        collectible.animations.add('idle', [6], 0, true);
        collectible.animations.add('open', [18, 30, 42], 10, false);
        collectible.animations.play('idle');
        collectible.name = 'chest';
        collectible.value = Math.floor(Math.random() * 150);

        return collectible;
    },

    createGold: function(enemy) {

        let collectible = this.pickUps.create(enemy.x, enemy.y, 'gold');
        collectible.animations.add('idle', [3], 0, true);
        collectible.animations.play('idle');
        collectible.name = 'gold';
        collectible.value = enemy.expGain * 2;
        return collectible;
    },

    createPotion: function(location) {
        //
        let rnd = Math.random(); // Random generator determines what potion is created
        if (rnd >= 0 && rnd < .4) {
            this.createHealthPotion(location);
        } else if (rnd >= .4 && rnd < .6) {
            this.createManaPotion(location);
        } else if (rnd >= .6 && rnd < .7) {
            this.createVitalityPotion(location);
        } else if (rnd >= .7 && rnd < .8) {
            this.createStrengthPotion(location);
        } else if (rnd >= .8 && rnd < .9) {
            this.createSpeedPotion(location);
        } else if (rnd >= .9 && rnd < 1) {
            this.createWisdomPotion(location);
        }
    },

    createHealthPotion: function(location) {

        var collectible = this.pickUps.create(location.x, location.y, 'potions', 0);
        collectible.name = 'healthPotion';
        collectible.value = 20 + Math.floor(Math.random() * 10) + this.player.level;
        return collectible;
    },

    createManaPotion: function(location) {

        var collectible = this.pickUps.create(location.x, location.y, 'potions', 1);
        collectible.name = 'manaPotion';
        collectible.value = 20 + Math.floor(Math.random() * 10);
        return collectible;
    },

    createVitalityPotion: function(location) {

        var collectible = this.pickUps.create(location.x, location.y, 'potions', 0);
        collectible.name = 'vitalityPotion';
        collectible.value = 4 + Math.floor(Math.random() * 5);
        return collectible;
    },

    createStrengthPotion: function(location) {

        var collectible = this.pickUps.create(location.x, location.y, 'potions', 2);
        collectible.name = 'strengthPotion';
        collectible.value = 1 + Math.floor(Math.random());
        return collectible;
    },

    createWisdomPotion: function(location) {

        var collectible = this.pickUps.create(location.x, location.y, 'potions', 2);
        collectible.name = 'wisdomPotion';
        collectible.value = 1 + Math.floor(Math.random());
        return collectible;
    },


    createSpeedPotion: function(location) {

        var collectible = this.pickUps.create(location.x, location.y, 'potions', 3);
        collectible.name = 'speedPotion';
        collectible.value = 1 + Math.floor(Math.random());
        return collectible;
    },

    createAudio: function() {

        this.attackAudio = this.game.add.audio('attackAudio');
        this.batAudio = this.game.add.audio('batAudio');
        this.levelUpAudio = this.game.add.audio('levelUpAudio');
        this.playerAudio = this.game.add.audio('playerAudio');
        this.potionAudio = this.game.add.audio('potionAudio');
        this.skeletonAudio = this.game.add.audio('skeletonAudio');
        this.impAudio = this.game.add.audio('impAudio');
        this.spiderAudio = this.game.add.audio('spiderAudio');
        this.spellAudio = this.game.add.audio('spellAudio');
        this.healAudio = this.game.add.audio('healAudio');
        this.dragonAudio = this.game.add.audio('dragonAudio');
        this.goblinAudio = this.game.add.audio('goblinAudio');
        this.goldAudio = this.game.add.audio('goldAudio');
    },


    playAudio: function(name) {

        if (name === this.player.name) {
            this.playerAudio.play();

        } else if (name === 'Skeleton') {
            this.skeletonAudio.play();

        } else if (name === 'Imp') {
            this.impAudio.play();

        } else if (name === 'Bat') {
            this.batAudio.play();

        } else if (name === 'Goblin') {
            this.goblinAudio.play();

        } else if (name === 'Spider') {
            this.spiderAudio.play();

        } else if (name === 'Dragon') {
            this.dragonAudio.play();
        }
    },


    muteGame: function() {

        // If music is running then it will pause the music and game sound. The musicstate persists through different states and screens/levels

        if (musicState === "running") {
            console.log(musicState);
            this.game.sound.mute = true;
            this.music.pause();
            musicState = "paused";
            console.log(musicState);
            this.muteButton = this.add.button(this.game.width / 1.1 + 61, this.game.height / 2 - 360, 'mutebutton', this.muteGame, this);
            this.muteButton.fixedToCamera = true;
            this.muteButton.scale.set(2);
        }

        //If music is paused then it will resume music and game sound. The musicstate persists through different states and screens/levels
        else if (musicState === "paused") {
            this.game.sound.mute = false;
            this.music.resume();
            console.log("the pause is running");
            console.log(this.music);
            musicState = "running";
            this.muteButton = this.add.button(this.game.width / 1.1 + 61, this.game.height / 2 - 360, 'unmutebutton', this.muteGame, this);
            this.muteButton.fixedToCamera = true;
            this.muteButton.scale.set(2);
        }
    },


    //Responsible for player movement. Speed affects movemenet speed

    playerMovementHandler: function() {

        // Up-Left
        if (this.controls.up.isDown && this.controls.left.isDown) {
            this.player.body.velocity.x = -this.player.speed;
            this.player.body.velocity.y = -this.player.speed;
            this.player.animations.play('left');

            // Up-Right
        } else if (this.controls.up.isDown && this.controls.right.isDown) {
            this.player.body.velocity.x = this.player.speed;
            this.player.body.velocity.y = -this.player.speed;
            this.player.animations.play('right');

            // Down-Left
        } else if (this.controls.down.isDown && this.controls.left.isDown) {
            this.player.body.velocity.x = -this.player.speed;
            this.player.body.velocity.y = this.player.speed;
            this.player.animations.play('left');

            // Down-Right
        } else if (this.controls.down.isDown && this.controls.right.isDown) {
            this.player.body.velocity.x = this.player.speed;
            this.player.body.velocity.y = this.player.speed;
            this.player.animations.play('right');

            // Up
        } else if (this.controls.up.isDown) {
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = -this.player.speed;
            this.player.animations.play('up');

            // Down
        } else if (this.controls.down.isDown) {
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = this.player.speed;
            this.player.animations.play('down');

            // Left
        } else if (this.controls.left.isDown) {
            this.player.body.velocity.x = -this.player.speed;
            this.player.body.velocity.y = 0;
            this.player.animations.play('left');

            // Right
        } else if (this.controls.right.isDown) {
            this.player.body.velocity.x = this.player.speed;
            this.player.body.velocity.y = 0;
            this.player.animations.play('right');
        }

        // If the player is not pressing any movement buttons then the player velocity is 0. No animations are played
        else {
            this.player.animations.stop();
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
        }
    },

    //Pressing the 'Q' button will allow the player to check his stats in-game. Letting fo of Q will remove the display

    playerShowStats: function() {
        if ((this.controls.showStats.isDown) && (this.inGameStatsLabel === undefined)) {
            let inGameStats = "Strength: " + strength + " Wisdom: " + wisdom + " Speed: " + speed + " vitality: " + vitality;
            let style = {
                font: '10px Flipps-Regular',
                fill: '#000000',
                align: 'center'
            };
            this.inGameStatsLabel = this.game.add.text(530, 10, inGameStats, style);
            this.inGameStatsLabel.fixedToCamera = true;
        }
        if (this.controls.showStats.isUp) {

            if (this.inGameStatsLabel !== undefined) {
                this.inGameStatsLabel.destroy();
                this.inGameStatsLabel = undefined;
            }
        }
    },

    // This function allows the player to cycle through his known spells by clicking the space bar
    // A different icon is displayed according to the selected spell
    // Each spell uses a different amount of mana and does different amounts of damage

    playerSpellSelector: function() {

        if (this.controls.spellRotation.isDown && (!this.buttonPressed)) {
            {
                this.selectedSpellName = this.unlockedSpells[this.index];
                console.log(this.selectedSpellName);
                this.notification += "\nChanged active spell to " + this.selectedSpellName;
                this.playerSpells = this.createAttacks(this.selectedSpellName, 10);
                this.buttonPressed = true;

                if (this.selectedSpellName.includes("plasma-spell")) {
                    this.spellHolderIcon = this.game.add.image(337, this.game.height - 67, 'plasma-spell-icon');
                    this.spellHolderIcon.fixedToCamera = true;
                    this.spellManaCost = 50;
                    this.spellDamageMultiplier = 3;
                } else if (this.selectedSpellName.includes("fire")) {
                    this.spellHolderIcon = this.game.add.image(337, this.game.height - 67, 'fireball-icon');
                    this.spellHolderIcon.fixedToCamera = true;
                    this.spellManaCost = 10;
                    this.spellDamageMultiplier = 1;
                } else if (this.selectedSpellName.includes("light")) {
                    this.spellHolderIcon = this.game.add.image(337, this.game.height - 67, 'light-spell-icon');
                    this.spellHolderIcon.fixedToCamera = true;
                    this.spellManaCost = 20;
                    this.spellDamageMultiplier = 2;
                } else if (this.selectedSpellName.includes("blood")) {
                    this.spellHolderIcon = this.game.add.image(337, this.game.height - 67, 'blood-spell-icon');
                    this.spellHolderIcon.fixedToCamera = true;
                    this.spellDamageMultiplier = 1.25;
                    this.spellManaCost = 15;
                }
            }
            ++this.index;
            if (this.index === this.unlockedSpells.length) {
                this.index = 0;
            }
        }
        if (this.controls.spellRotation.isUp) {
            this.buttonPressed = false;
        }
    },


    // The health/exp/mana bars are cropped according to what percentage the player currently has

    statusBarTracker: function() {
        // Health tracking
        this.healthStatus = ((this.player.health / vitality) * 115);
        this.cropHealth = new Phaser.Rectangle(0, 0, this.healthStatus, 20);
        this.healthUi.crop(this.cropHealth);

        // Update the level indicator inside of the GUI
        this.levelUI.setText(this.player.level);
        // Mana tracking
        this.manaStatus = ((this.playerMana / this.maxPlayerMana) * 115);
        this.cropMana = new Phaser.Rectangle(0, 0, this.manaStatus, 20);
        this.manaUi.crop(this.cropMana);
        //    console.log(this.cropMana);
        //XP tracking
        this.xpStatus = ((this.xp / this.xpToNext) * 115);
        this.cropXp = new Phaser.Rectangle(0, 0, this.xpStatus, 20);
        this.expUi.crop(this.cropXp);
        //   console.log(this.cropXp);

        // This block of code below ensures that the text does not overflow the text box GUI element

        if ((this.notification.split('\n').length) > 6) {
            this.notification = '';
        }
    },

    //Responsible for enemy movement and their animations

    enemyMovementHandler: function(enemy) {

        // Left
        if (enemy.body.velocity.x < 0 && enemy.body.velocity.x <= -Math.abs(enemy.body.velocity.y)) {
            enemy.animations.play('left');

            // Right
        } else if (enemy.body.velocity.x > 0 && enemy.body.velocity.x >= Math.abs(enemy.body.velocity.y)) {
            enemy.animations.play('right');

            // Up
        } else if (enemy.body.velocity.y < 0 && enemy.body.velocity.y <= -Math.abs(enemy.body.velocity.x)) {
            enemy.animations.play('up');

            // Down
        } else {
            enemy.animations.play('down');
        }
    },

    //Runs when the player dies

    gameOver: function() {

        this.background.destroy();
        this.corpses.destroy();
        this.pickUps.destroy();
        this.greenery.destroy();
        this.portals.destroy();
        this.player.destroy();
        this.playerAttacks.destroy();
        this.enemies.destroy();
        console.log("is this running");

        // Automatically updating the high-score if a new score is reached

        if (floorLevel > maxFloor) {
            maxFloor = floorLevel - 1;
            console.log("floor level is " + floorLevel);
            console.log("max floor is " + maxFloor);
        }

        ////// The currently logged in user is stored is gotten from the session and not local storage
        this.loggedInUser = (JSON.parse(sessionStorage.getItem("LoggedInUser") || "0"));

        //// The below method adds the user to the high-score user list

        // Add the date to the score

        let dateObj = new Date();
        let month = dateObj.getUTCMonth() + 1;
        let day = dateObj.getUTCDate();
        let year = dateObj.getUTCFullYear();
        let dateOfRun = year + "/" + month + "/" + day;

        // Putting the user score into local storage

        this.populateHiScoresInStorage(dateOfRun, this.loggedInUser.username);

        floorLevel = 1;
        this.music.stop();
        this.music.destroy();
        this.attackAudio.destroy();
        this.playerAudio.destroy();
        this.skeletonAudio.destroy();
        this.impAudio.destroy();
        this.batAudio.destroy();
        this.goblinAudio.destroy();
        this.spiderAudio.destroy();
        this.goldAudio.destroy();
        this.continueMusic = false;
        // Sends the player to the shop menu
        this.goToShopMenu();
    },

    // Saves the player score to the local storage

    populateHiScoresInStorage: function(dateOfRun, loggedUser) {

        let highScoreList = JSON.parse(localStorage.getItem("HighScoreList") || "[]");
        console.log("# of records in high-scores: " + highScoreList.length);
        let i = 0;
        let found = false;
        for (i; i < highScoreList.length; ++i) {
            console.log("loop ran");
            if (highScoreList[i].username === loggedUser) {
                highScoreList[i].MaxFloor = maxFloor;
                highScoreList[i].Date = dateOfRun;
                found = true;
                break;
            }
        }

        if (!found) {
            //// If the logged in user is not found inside of the hi-score list then a new user will be added
            let userToAdd = {
                'username': loggedUser,
                'MaxFloor': maxFloor,
                'Date': dateOfRun
            };
            highScoreList.push(userToAdd);
            console.log("user added to high score list");
        }

        // This should always run. If the user is updated or if a new user is added
        localStorage.setItem('HighScoreList', JSON.stringify(highScoreList));
        console.log("local storage highscorelist updated");
    },

    goToShopMenu: function() {
        this.player.health = vitality;
        this.playerMana = this.maxPlayerMana;
        this.player.alive = true;
        this.game.state.start('Shop', true, false, this.xp + this.gold, this.player);
    },

    rng: function(floor, ceiling) {
        floor /= 10;
        ceiling /= 10;
        let rnd = Math.random();
        return rnd >= floor && rnd < ceiling;
    },

    createGrid: function(worldSize) {
        // The world is split into an array of grids of size 32x32 which is shuffled

        this.grid = [];
        let gridSize = 32;
        let grids = Math.floor(worldSize / gridSize);
        for (let x = 0; x < grids; x++) {
            for (let y = 0; y < grids; y++) {
                let gridX = x * gridSize;
                let gridY = y * gridSize;
                this.grid.push({
                    x: gridX,
                    y: gridY
                });
            }
        }
        this.shuffle(this.grid);
    },

    // Random indexes are obtained from the grid. These will act as randomly chosen locations on the map
    getRandomLocation: function() {

        let gridIndex = 0;
        let x = this.grid[gridIndex].x;
        let y = this.grid[gridIndex].y;
        this.grid.splice(gridIndex, 1);
        gridIndex++;
        if (gridIndex === this.grid.length) {
            this.shuffle(this.grid);
            gridIndex = 0;
        }
        return {
            x,
            y
        };
    },

    // The grid is shuffled
    shuffle: function(grid) {
        let currentIndex = grid.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = grid[currentIndex];
            grid[currentIndex] = grid[randomIndex];
            grid[randomIndex] = temporaryValue;
        }

        return grid;
    }
};