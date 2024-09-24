class ThrowAbleObject extends MovableObject {

    IMAGES_FLYING_BOTTLE = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    IMAGES_BOTTLE_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    splash = false;

    constructor(pos_x, pos_y, throwLeft) {
        super();
        this.loadImg('assets/img/6_salsa_bottle/salsa_bottle.png');
        this.loadImages(this.IMAGES_FLYING_BOTTLE);
        this.loadImages(this.IMAGES_BOTTLE_SPLASH);
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.throwLeft = throwLeft;
        this.width = 80;
        this.height = 80;
        this.checkBottlesAmount();
        this.throwSettings();
        this.throwBottleAnimation();
    }

    /**
     * Checks if the character has bottles and decreases the count.
     */
    checkBottlesAmount() {
        if (world.character.gotBottles > 0) {
            world.character.gotBottles -= 20;
            world.statusBarBottle.setPercentageBottles(world.character.gotBottles);
        }
    }

    /**
     * Sets the initial throw settings, including gravity and position adjustment.
     */
    throwSettings() {
        this.speedYGravity = 3;
        this.applyGravityBottles();
        this.leftMoveThrowPosition();
    }

    /**
     * Adjusts the position of the object if it is thrown to the left.
     */
    leftMoveThrowPosition() {
        if (this.throwLeft) {
            this.pos_x -= 100;
            this.pos_y += 40;
        }
    }

    /**
     * Starts the animation for the thrown bottle, including movement and rotation.
     */
    throwBottleAnimation() {
        this.throwBottleMove();
        this.bottleAnimation();
    }

    /**
     * Moves the bottle in the specified direction at regular intervals.
     */
    throwBottleMove() {
        let interval = setInterval(() => {
            if (this.throwLeft) {
                this.pos_x -= 7;
            } else {
                this.pos_x += 7;
            }
            animationIntervals.push(interval);
        }, 10);
    }

    /**
     * Animates the rotation of the flying bottle at regular intervals.
     */
    bottleAnimation() {
        let interval = setInterval(() => {
            this.playAnimation(this.IMAGES_FLYING_BOTTLE);
            if (this.splash) {
                clearInterval(interval);
            }
            animationIntervals.push(interval);
        }, 60);
    }

    /**
     * Starts the bottle splash animation upon collision.
     * @param {Object} enemy - The enemy object that the bottle collides with.
     */
    startBottleSplash(enemy) {
        this.splash = true;
        let interval = setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
            this.handleCollision(enemy);
            clearInterval(interval);
            this.splash = false;
        }, 10);
    }

    /**
     * Handles the collision with an enemy.
     * @param {Object} enemy - The enemy object that the bottle collides with.
     */
    handleCollision(enemy) {
        if (enemy instanceof Endboss) {
            this.onHitEndboss(enemy);
        } else {
            this.onHitEnemy(enemy);
        }
    }

    /**
     * Handles the collision with the end boss.
     * @param {Endboss} endboss - The end boss object that the bottle collides with.
     */
    onHitEndboss(endboss) {
        endboss.takeDamage(endboss);
    }

    /**
     * Handles the collision with a regular enemy.
     * @param {Object} enemy - The enemy object that the bottle collides with.
     */
    onHitEnemy(enemy) {
        enemy.deadAnimateChicken(enemy);
    }
}
