class World {
    GAME_OVER_SCREEN = [
        'assets/img/9_intro_outro_screens/game_over/game over!.png',
        'assets/img/9_intro_outro_screens/game_over/game over.png',
        'assets/img/9_intro_outro_screens/game_over/oh no you lost!.png',
        'assets/img/9_intro_outro_screens/game_over/you lost.png'
    ];

    GAME_WON_SCREEN = [
        'assets/img/9_intro_outro_screens/win/win_1.png',
        'assets/img/9_intro_outro_screens/win/win_2.png',
        'assets/img/9_intro_outro_screens/win/won_1.png',
        'assets/img/9_intro_outro_screens/win/won_2.png'
    ];

    constructor(canvas, keyboard) {
        this.character = new Character();
        this.endboss = new Endboss();
        this.statusBar = new StatusBar();
        this.statusBarBottle = new StatusBarBottles();
        this.statusBarCoins = new StatusBarCoins();
        this.statusBarEndboss = new StatusBarEndboss();
        this.chicken = new Chicken();
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.backgroundObjects = [];
        this.offset = -1498;
        this.coins = [];
        this.bottles = [];
        this.throwableObjects = [];
        this.level = level1;
        this.camera_pos_x = 0;
        this.ctx = canvas.getContext('2d');
        this.backgroundGenerator = new BackgroundGenerator(this.level, this.offset);
        this.collisionManager = new CollisionManager(this); 
        this.renderer = new Renderer(this);
        this.setWorld();
        this.generateCoinsAndBottles();
        this.initSounds();
        this.backgroundObjects = this.backgroundGenerator.generateBackground();
        this.renderer.draw();
        this.monitorGameEvents();
        this.throwByKeypress();
    }

    /**
     * Monitors game events like collision detection and item collection.
     */
    monitorGameEvents() {
        const interval = setInterval(() => {
            this.collisionManager.checkCollisionEnemy();
            this.checkCollectionCoin();
            this.checkCollectionBottle();
            this.checkCollisionByThrowableObjects();
            animationIntervals.push(interval);
        }, 50);
    }

    /**
     * Starts the game by initializing background objects, coins, and bottles, and begins the rendering and event monitoring.
     */
    startGame() {
        this.backgroundObjects = this.backgroundGenerator.generateBackground();
        this.generateCoinsAndBottles();
        this.renderer.draw();
        this.monitorGameEvents();
    }

    /**
     * Generates coins and bottles in the game world.
     */
    generateCoinsAndBottles() {
        this.coins = Coins.generateCoins(5, 100);
        this.bottles = Bottles.generateBottles(10, 200);
    }

    /**
     * Sets the world reference for the character.
     */
    setWorld() {
        this.character.world = this;
    }

    /**
     * Initializes sounds for the game.
     */
    initSounds() {
        this.empty_bottles_sound = new Audio('assets/audio/empty.mp3');
        this.throwing_bottles_sound = new Audio('assets/audio/throwing.mp4');
        this.won_sound = new Audio('assets/audio/won_sound.mp3');
        this.loose_sound = new Audio('assets/audio/loose_sound.mp3');
        this.chicken_dead_sound = new Audio('assets/audio/chicken_dead.mp3');
    }

    /**
     * Checks if the character is collecting coins and updates the status bar accordingly.
     */
    checkCollectionCoin() {
        this.coins.forEach((coin) => {
            if (this.character.isCollectingCoins(coin)) {
                this.character.collectCoin(coin);
                this.statusBarCoins.setPercentageCoins(this.character.gotCoins);
            }
        });
    }

    /**
     * Checks if the character is collecting bottles and updates the status bar accordingly.
     */
    checkCollectionBottle() {
        this.bottles.forEach((bottle) => {
            if (this.character.isCollectingBottles(bottle)) {
                this.character.collectBottle(bottle);
                this.statusBarBottle.setPercentageBottles(this.character.gotBottles);
            }
        });
    }

    /**
     * Throws a bottle when the space key is pressed, if the character has bottles available.
     */
    throwByKeypress() {
        let interval = setInterval(() => {
            if (this.keyboard.SPACE) {
                let throwLeft = this.character.otherDirection;
                this.initBottleThrow(throwLeft);
            }
            animationIntervals.push(interval);
        }, 200);
    }

    /**
     * Initializes the throwing of a bottle by the character.
     * @param {boolean} throwLeft - Indicates whether the bottle should be thrown to the left.
     */
    initBottleThrow(throwLeft) {
        if (this.character.gotBottles > 0 && this.character.gotBottles <= 100) {
            let bottle = new ThrowAbleObject(this.character.pos_x + 100, this.character.pos_y + 100, throwLeft);
            this.throwableObjects.push(bottle);
            if (sound) {
                this.throwing_bottles_sound.play();
            }
        } else {
            if (sound) {
                this.empty_bottles_sound.play();
            }
        }
    }

    /**
     * Checks for collisions with throwable objects (bottles).
     */
    checkCollisionByThrowableObjects() {
        let interval = setInterval(() => {
            this.checkCollisionWithBottle();
            animationIntervals.push(interval);
        }, 100);
    }

    /**
     * Checks for collisions between throwable objects (bottles) and enemies.
     */
    checkCollisionWithBottle() {
        this.throwableObjects.forEach((throwableObject) => {
            throwableObject.checkBottleCollision(this.level.enemies);
        });
    }

    /**
     * Removes an enemy from the list of enemies in the current level.
     * @param {Enemy} enemy - The enemy object to be removed.
     */
    removeEnemy(enemy) {
        const index = this.level.enemies.indexOf(enemy);
        if (index > -1) {
            this.level.enemies.splice(index, 1);
        }
    }

    /**
     * Stops all ongoing animations.
     */
    stopAllAnimations() {
        animationIntervals.forEach(interval => clearInterval(interval));
        animationIntervals = [];
    }

    /**
     * Ends the game and forwards to the game over screen.
     */
    async quitGame() {
        gameOver = true;
        gameplay_sound.pause();
        endboss_sound.pause();
        await this.changeButtonsAfterDead();
        await this.forwardToGameOverScreen();
    }

    /**
     * Changes the visibility of menu buttons after the character is dead.
     */
    async changeButtonsAfterDead() {
        document.getElementById('menuIconActivateBreak').style.display = 'none';
        document.getElementById('restartBtnMenu').style.display = 'flex';
        document.getElementById('continuePlayBtnMenu').style.display = 'none';
    }

    /**
     * Forwards to the game over screen and displays a random game over image.
     */
    async forwardToGameOverScreen() {
        document.getElementById('gameMenuButtons').style.display = 'none';
        if (wonGame) {
            await this.handleWonGame();
        } else {
            await this.handleLostGame();
        }
    }

    /**
     * Handles the actions when the game is won.
     */
    async handleWonGame() {
        this.stopBattleSound();
        this.initWonSound();
        await this.sleep(300);
        this.showWonTitle();
        await this.sleep(4500);
        exitGame();
    }

    /**
     * Handles the actions when the game is lost.
     */
    async handleLostGame() {
        this.stopGameSound();
        this.initLooseSound();
        await this.sleep(300);
        this.showLooseTitle();
        await this.sleep(4500);
        exitGame();
    }

    /**
     * Pauses execution for a specified duration.
     * @param {number} ms - The duration in milliseconds to pause.
     * @returns {Promise} A promise that resolves after the specified duration.
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Shows the title indicating the game is won.
     */
    showWonTitle() {
        this.renderer.draw();
        let img = new Image();
        img.src = this.GAME_WON_SCREEN[1];
        img.onload = () => {
            let x = 180;
            let y = 0;
            let width = 400;
            let height = 480;
            this.ctx.drawImage(img, x, y, width, height);
        };
    }

    /**
     * Shows the title indicating the game is lost.
     */
    showLooseTitle() {
        this.renderer.draw();
        let i = Math.floor(Math.random() * this.GAME_OVER_SCREEN.length);
        let img = new Image();
        img.src = this.GAME_OVER_SCREEN[i];
        img.onload = () => {
            let x = 0;
            let y = 0;
            let width = 760;
            let height = 480;
            this.ctx.drawImage(img, x, y, width, height);
        };
    }

    /**
     * Stops the battle sound.
     */
    stopBattleSound() {
        endboss_sound.pause();
    }

    /**
     * Stops the game sound.
     */
    stopGameSound() {
        gameplay_sound.pause();
    }

    /**
     * Initializes the sound for when the game is lost.
     */
    initLooseSound() {
        if (sound) {
            this.loose_sound.play();
        }
    }

    /**
     * Initializes the sound for when the game is won.
     */
    initWonSound() {
        if (sound) {
            this.won_sound.play();
        }
    }

    /**
     * Toggles the state of animations in the game.
     */
    toggleAnimations() {
        if (breakGame) {
            this.stopAllAnimations();
        } else {
            this.continueAllAnimations();
        }
    }

    /**
     * Continues all animations that were stopped.
     */
    continueAllAnimations() {
        this.monitorGameEvents();
        this.character.monitoringPepe();
        this.character.moveAnimationsPepe();
        this.character.monitorPepeIsJumping();
        this.character.playJumpingAnimation();
        this.character.applyGravity();
        this.checkCollisionByThrowableObjects();
        this.continueAllClouds();
        this.continueAllCoins();
        this.continueAllBottles();
        this.continueAnimateAllChickens();
        this.continueAllThrowables();
        this.throwByKeypress();
    }

    /**
     * Continues the animation of all clouds.
     */
    continueAllClouds() {
        this.level.clouds.forEach(cloud => {
            cloud.animateClouds();
        });
    }

    /**
     * Continues the animation of all coins.
     */
    continueAllCoins() {
        this.coins.forEach(coin => {
            coin.animateCoins();
        });
    }

    /**
     * Continues the animation of all chickens.
     */
    continueAnimateAllChickens() {
        this.level.enemies.forEach(enemy => {
            if (enemy.enemyType == 'endboss') {
                enemy.initBattleSound();
                enemy.animationAlertEndboss();
                enemy.monitoringBattle();
            } else {
                enemy.monitoringChicken();
                enemy.animateChicken();
            }
        });
    }

    /**
     * Continues the animation of all bottles.
     */
    continueAllBottles() {
        this.bottles.forEach(bottle => {
            bottle.animateBottles();
        });
    }

    /**
     * Continues the animation of all throwable objects.
     */
    continueAllThrowables() {
        this.throwableObjects.forEach(throwable => {
            if (throwable instanceof ThrowAbleObject) {
                throwable.throwBottleMove();
                throwable.bottleAnimation();
            }
        });
    }
}