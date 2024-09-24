class Character extends MovableObject {

    IMAGES_IDLE = [
        'assets/img/2_character_pepe/1_idle/idle/I-1.png',
        'assets/img/2_character_pepe/1_idle/idle/I-2.png',
        'assets/img/2_character_pepe/1_idle/idle/I-3.png',
        'assets/img/2_character_pepe/1_idle/idle/I-4.png',
        'assets/img/2_character_pepe/1_idle/idle/I-5.png',
        'assets/img/2_character_pepe/1_idle/idle/I-6.png',
        'assets/img/2_character_pepe/1_idle/idle/I-7.png',
        'assets/img/2_character_pepe/1_idle/idle/I-8.png',
        'assets/img/2_character_pepe/1_idle/idle/I-9.png',
        'assets/img/2_character_pepe/1_idle/idle/I-10.png'
    ];

    IMAGES_IDLE_LONG = [
        'assets/img/2_character_pepe/1_idle/long_idle/I-11.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-12.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-13.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-14.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-15.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-16.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-17.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-18.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-19.png',
        'assets/img/2_character_pepe/1_idle/long_idle/I-20.png'
    ];

    IMAGES_WALKING = [
        'assets/img/2_character_pepe/2_walk/W-21.png',
        'assets/img/2_character_pepe/2_walk/W-22.png',
        'assets/img/2_character_pepe/2_walk/W-23.png',
        'assets/img/2_character_pepe/2_walk/W-24.png',
        'assets/img/2_character_pepe/2_walk/W-25.png',
        'assets/img/2_character_pepe/2_walk/W-26.png'
    ];

    IMAGES_JUMPING = [
        'assets/img/2_character_pepe/3_jump/J-31.png',
        'assets/img/2_character_pepe/3_jump/J-32.png',
        'assets/img/2_character_pepe/3_jump/J-33.png',
        'assets/img/2_character_pepe/3_jump/J-34.png',
        'assets/img/2_character_pepe/3_jump/J-35.png',
        'assets/img/2_character_pepe/3_jump/J-36.png',
        'assets/img/2_character_pepe/3_jump/J-37.png',
        'assets/img/2_character_pepe/3_jump/J-38.png',
        'assets/img/2_character_pepe/3_jump/J-39.png'
    ];

    IMAGES_HURTING = [
        'assets/img/2_character_pepe/4_hurt/H-41.png',
        'assets/img/2_character_pepe/4_hurt/H-42.png',
        'assets/img/2_character_pepe/4_hurt/H-43.png'
    ];

    IMAGES_DEAD = [
        'assets/img/2_character_pepe/5_dead/D-51.png',
        'assets/img/2_character_pepe/5_dead/D-52.png',
        'assets/img/2_character_pepe/5_dead/D-53.png',
        'assets/img/2_character_pepe/5_dead/D-54.png',
        'assets/img/2_character_pepe/5_dead/D-55.png',
        'assets/img/2_character_pepe/5_dead/D-56.png'
    ];

    constructor() {
        super();
        this.loadImg('assets/img/2_character_pepe/2_walk/W-21.png');
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_IDLE_LONG);
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(this.IMAGES_JUMPING);
        this.loadImages(this.IMAGES_HURTING);
        this.loadImages(this.IMAGES_DEAD);
        this.standingStillTime = 0;
        this.monitoringPepe();
        this.walking_sound = new Audio('assets/audio/walk.mp4');
        this.moveAnimationsPepe();
        this.setLooseCoinsPossible = false;
        this.applyGravity();
        this.height = 300;
        this.width = 130;
        this.pos_y = -60;
        this.pos_x = 0;
        this.world;
        this.speed = 5;
        this.lastMoveTime = 0;
        this.lastMoveTime = Date.now();
        this.isJumping = false;
        this.monitorPepeIsJumping();
    }

    /**
     * Monitors the character's state and updates animations accordingly.
     */
    monitoringPepe() {
        const interval = setInterval(() => {
            this.monitorStandingStill();
            this.monitorPepeIsHurt();
            this.monitorPepeIsMovingLeftRight();
            this.checkGetCloseToEndboss();
            this.checkIfPepeIsDead();
            animationIntervals.push(interval);
        }, 90);
    }

    /**
     * Monitors if the character is standing still and plays the appropriate idle animation.
     */
    monitorStandingStill() {
        const currentTime = Date.now();
        if (this.isMoving()) {
            this.lastMoveTime = currentTime;
        } else {
            const timeStandingStill = currentTime - this.lastMoveTime;
            if (timeStandingStill >= 6000) {
                this.playAnimation(this.IMAGES_IDLE_LONG);
            } else if (timeStandingStill >= 100) {
                this.playAnimation(this.IMAGES_IDLE);
            }
        }
    }

    /**
     * Monitors if the character is hurt and plays the hurt animation.
     */
    monitorPepeIsHurt() {
        if (this.isHurt()) {
            this.playAnimation(this.IMAGES_HURTING);
        }
    }

    /**
     * Monitors if the character is jumping.
     */
    monitorPepeIsJumping() {
        const interval = setInterval(() => {
            if (this.isAboveGround() && !this.isJumping) {
                this.isJumping = true;
                this.playJumpingAnimation();
            } else if (!this.isAboveGround()) {
                this.isJumping = false;
            }
            animationIntervals.push(interval);
        }, 50);
    }

    /**
     * This function initiate the jump animation.
     */
    playJumpingAnimation() {
        let currentImageIndex = 0;
        const jumpAnimationInterval = setInterval(() => {
            if (this.isAboveGround()) {
                this.img = this.imageCache[this.IMAGES_JUMPING[currentImageIndex]];
                currentImageIndex++;
                if (currentImageIndex >= this.IMAGES_JUMPING.length) {
                    clearInterval(jumpAnimationInterval);
                }
            }
            animationIntervals.push(jumpAnimationInterval);
        }, 100);
    }

    /**
    * Monitors if the character is moving left or right and plays the walking animation.
    */
    monitorPepeIsMovingLeftRight() {
        if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT || this.world.keyboard.A || this.world.keyboard.D) {
            if (!this.isAboveGround()) {
                this.playAnimation(this.IMAGES_WALKING);
            }
            if (sound && !this.isAboveGround()) {
                this.walking_sound.play();
            }
        }
    }

    /**
     * Checks if the character is currently moving.
     * @returns {boolean} True if the character is moving, false otherwise.
     */
    isMoving() {
        return this.world.keyboard.LEFT || this.world.keyboard.RIGHT || this.world.keyboard.A || this.world.keyboard.D || this.world.keyboard.UP || this.world.keyboard.W || this.world.keyboard.SPACE;
    }

    /**
     * Checks if the character is dead and handles the death sequence.
     */
    checkIfPepeIsDead() {
        if (this.isDead()) {
            pepeIsDead = true;
            this.world.stopAllAnimations();
            this.animatePepesDead();
        }
    }

    /**
     * Handles the death animation sequence of the character asynchronously.
     */
    async animatePepesDead() {
        if (pepeIsDead) {
            await this.pepesDeadAnimation();
            await this.setEndImagePosition();
            await this.pepeIsFlyingAway();
            await this.world.quitGame();
        }
    }

    /**
    * Plays the death animation of the character.
    * @returns {Promise} A promise that resolves when the animation is complete.
    */
    pepesDeadAnimation() {
        return new Promise((resolve) => {
            let currentImageIndex = 0;
            const interval = setInterval(() => {
                this.playAnimation([this.IMAGES_DEAD[currentImageIndex]]);
                currentImageIndex++;
                if (currentImageIndex >= this.IMAGES_DEAD.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, 200);
        });
    }

    /**
     * Sets the final image position for the death animation.
     * @returns {Promise} A promise that resolves immediately.
     */
    setEndImagePosition() {
        return new Promise((resolve) => {
            this.img = this.imageCache['assets/img/2_character_pepe/5_dead/D-56.png'];
            resolve();
        });
    }

    /**
     * Animates the character flying away after death.
     * @returns {Promise} A promise that resolves when the animation is complete.
     */
    pepeIsFlyingAway() {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                this.pos_y += 3;
                this.pos_x += 2;
                if (this.pos_y > this.world.canvas.height || this.pos_x > this.world.canvas.width) {
                    clearInterval(interval);
                    resolve();
                }
            }, 1000 / 60);
        });
    }

    /**
     * Monitors and handles the character's movement animations.
     */
    moveAnimationsPepe() {
        const interval = setInterval(() => {
            this.movePepeRight();
            this.movePepeLeft();
            this.movePepeJump();
            this.world.camera_pos_x = -this.pos_x + 100;
        }, 1000 / 60);
        animationIntervals.push(interval);
    }

    /**
     * Moves the character to the right if conditions are met.
     */
    movePepeRight() {
        if (this.conditionsForMovingRight()) {
            this.moveRight();
        }
    }

    /**
     * Checks the conditions for moving the character to the right.
     * @returns {boolean} True if the character can move right, false otherwise.
     */
    conditionsForMovingRight() {
        return (this.world.keyboard.RIGHT || this.world.keyboard.D) && this.pos_x < this.world.level.level_end_pos_x;
    }

    /**
    * Moves the character to the left if conditions are met.
    */
    movePepeLeft() {
        if (this.conditionsForMovingLeft()) {
            this.otherDirection = true;
            this.moveLeft();
        }
    }

    /**
     * Checks the conditions for moving the character to the left.
     * @returns {boolean} True if the character can move left, false otherwise.
     */
    conditionsForMovingLeft() {
        return (this.world.keyboard.LEFT || this.world.keyboard.A) && this.pos_x > 0;
    }

    /**
     * Makes the character jump if conditions are met.
     */
    movePepeJump() {
        if (this.conditionsForMovingJump()) {
            if (!this.isAboveGround()) {
                this.jump();
            }
        }
    }

    /**
     * Checks the conditions for making the character jump.
     * @returns {boolean} True if the character can jump, false otherwise.
     */
    conditionsForMovingJump() {
        return this.world.keyboard.UP || this.world.keyboard.W;
    }

    /**
     * Checks if the character is close to the end boss and sets relevant flags.
     */
    checkGetCloseToEndboss() {
        if (this.getCloseToEndboss()) {
            endbossBattleStatus = true;
            this.setLooseCoinsPossible = true;
        }
    }

    /**
     * Determines if the character is close to the end boss.
     * @returns {boolean} True if the character is close to the end boss, false otherwise.
     */
    getCloseToEndboss() {
        return this.pos_x >= 1850;
    }
}
