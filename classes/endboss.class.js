class Endboss extends MovableObject {
    pos_y = 140;
    height = 300;
    width = 200;
    enemyType = 'endboss';
    hasBeenHit = false;
    endbossIsDead = false;
    lastDamageTime = 0;
    damageCooldown = 1000;

    IMAGES_WALKING_ENDBOSS = [
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G2.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G1.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G3.png',
        'assets/img/4_enemie_boss_chicken/1_walk/G4.png'
    ];

    IMAGES_ALERT_ENDBOSS = [
        'assets/img/4_enemie_boss_chicken/2_alert/G5.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G6.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G7.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G8.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G9.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G10.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G11.png',
        'assets/img/4_enemie_boss_chicken/2_alert/G12.png'
    ];

    IMAGES_ATTACK_ENDBOSS = [
        'assets/img/4_enemie_boss_chicken/3_attack/G13.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G14.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G15.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G16.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G17.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G18.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G19.png',
        'assets/img/4_enemie_boss_chicken/3_attack/G20.png'
    ];

    IMAGES_HURT_ENDBOSS = [
        'assets/img/4_enemie_boss_chicken/4_hurt/G21.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G22.png',
        'assets/img/4_enemie_boss_chicken/4_hurt/G23.png'
    ];

    IMGAGES_DEAD_ENDBOSS = [
        'assets/img/4_enemie_boss_chicken/5_dead/G24.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G25.png',
        'assets/img/4_enemie_boss_chicken/5_dead/G26.png'
    ];

    constructor() {
        super().loadImg(this.IMAGES_ALERT_ENDBOSS[0]);
        this.loadImages(this.IMAGES_WALKING_ENDBOSS);
        this.loadImages(this.IMAGES_ALERT_ENDBOSS);
        this.loadImages(this.IMAGES_ATTACK_ENDBOSS);
        this.loadImages(this.IMAGES_HURT_ENDBOSS);
        this.loadImages(this.IMGAGES_DEAD_ENDBOSS);
        this.pos_x = 2500;
        this.energy = 100;
        this.alert = false;
        this.jumpingProgress = 0;
        this.jumpingUp = true;
        this.jumpExecuted = false;
        this.jumpInProgress = false;
        this.otherDirection = false;
        this.isResting = false;
        this.initBattleSound();
        this.animationAlertEndboss();
        this.monitoringBattle();
    }

    /**
    * Monitors the end boss and triggers battle status actions.
    */
    initBattleSound() {
        const interval = setInterval(() => {
            if (endbossBattleStatus) {
                playGameSound();
            }
            animationIntervals.push(interval);
        }, 100);
    }

    /**
     * Monitors the battle events with the end boss.
     */
    monitoringBattle() {
        const interval = setInterval(() => {
            if (endbossBattleStatus && !this.checkNoEnergy() && !this.isResting && this.alert) {
                this.handleBattleStatus();
            } else if (endbossBattleStatus && this.checkNoEnergy()) {
                this.handleEndbossDefeat(interval);
            }
            animationIntervals.push(interval);
        }, 100);
    }

    /**
     * Handles the battle status and triggers appropriate actions based on the distance to the character.
     */
    handleBattleStatus() {
        if (world && world.character) {
            const distance = world.character.pos_x - this.pos_x;
            this.updateDirection(world.character.pos_x);
            this.executeBattleActions(distance);
        }
    }

    /**
     * Updates the direction the end boss is facing based on the character's position.
     * @param {number} characterPosX - The x position of the character.
     */
    updateDirection(characterPosX) {
        if (characterPosX > this.pos_x) {
            this.otherDirection = true;
        } else {
            this.otherDirection = false;
        }
    }

    /**
     * Executes the appropriate battle actions based on the distance to the character.
     * @param {number} distance - The distance between the end boss and the character.
     */
    executeBattleActions(distance) {
        if (Math.abs(distance) <= 30) {
            this.initFlyBack();
            this.initJustFokus();
        } else {
            this.determineAttackOrMove(distance);
        }
    }

    /**
     * Determines whether the end boss should attack or move based on the distance to the character.
     * @param {number} distance - The distance between the end boss and the character.
     */
    determineAttackOrMove(distance) {
        if (Math.abs(distance) >= 300 && this.alert) {
            this.initWalkingAnimationEndboss();
        } else if (Math.abs(distance) < 300 && Math.abs(distance) > 200 && this.alert && !this.jumpExecuted) {
            this.initAttackAnimationEndboss();
            this.initJumpingAnimationEndboss();
        } else if (Math.abs(distance) < 300 && Math.abs(distance) >= 0 && this.alert && this.jumpExecuted) {
            this.initWalkingAnimationEndboss();
            this.initAttackAnimationEndboss();
        }
    }

    /**
     * Handles the end boss defeat scenario.
     * @param {number} interval - The interval ID to clear.
     */
    handleEndbossDefeat(interval) {
        if (world && world.character) {
            wonGame = true;
            clearInterval(interval);
            this.initDeadAnimationEndboss();
        }
    }

    /**
     * Moves the endboss away from Pepe if they are at the same position.
     */
    initFlyBack() {
        this.playAnimation(this.IMAGES_WALKING_ENDBOSS);
        const flyBackDistance = 50;
        if (this.otherDirection) {
            this.pos_x += flyBackDistance;
        } else {
            this.pos_x -= flyBackDistance;
        }
    }

    /**
     * Makes the endboss rest for a short period after moving away.
     */
    initJustFokus() {
        this.isResting = true;
        this.alert = false;
        this.jumpingProgress = 0;
        this.jumpingUp = true;
        this.jumpExecuted = false;
        this.jumpInProgress = false;
        this.animationAlertEndboss();
        setTimeout(() => {
            this.isResting = false;
        }, 1000);
    }

    /**
     * Plays the alert animation for the endboss once.
     */
    animationAlertEndboss() {
        let index = 0;
        const interval = setInterval(() => {
            if (endbossBattleStatus && !this.checkNoEnergy() && !this.isResting && !this.alert) {
                if (index < this.IMAGES_ALERT_ENDBOSS.length) {
                    this.playAnimation(this.IMAGES_ALERT_ENDBOSS);
                    index++;
                } else {
                    clearInterval(interval);
                    this.alert = true;
                }
            }
            animationIntervals.push(interval);
        }, 200);
    }

    /**
   * Initializes the walking animation for the endboss.
   */
    initWalkingAnimationEndboss() {
        this.playAnimation(this.IMAGES_WALKING_ENDBOSS);
        if (this.otherDirection) {
            this.pos_x += 15;
        } else {
            this.pos_x -= 15;
        }
    }

    /**
     * Initializes the attack animation for the endboss.
     */
    initAttackAnimationEndboss() {
        this.playAnimation(this.IMAGES_ATTACK_ENDBOSS);
        if (this.otherDirection) {
            this.pos_x += 5;
        } else {
            this.pos_x -= 5;
        }
    }

    /**
      * Initializes the jumping animation for the end boss.
      * The end boss jumps to the left and lands back at pos_y = 140.
      */
    initJumpingAnimationEndboss() {
        if (this.jumpExecuted || this.jumpInProgress) {
            return;
        }

        this.jumpInProgress = true;

        const maxJumpHeight = 100;
        const maxJumpDistance = 90;
        const jumpSpeed = 15;
        const gravity = 7;

        this.executeJump(maxJumpHeight, maxJumpDistance, jumpSpeed, gravity);
    }

    /**
     * Executes the jump animation with given parameters.
     * @param {number} maxJumpHeight - The maximum height the end boss can jump.
     * @param {number} maxJumpDistance - The maximum distance the end boss can jump.
     * @param {number} jumpSpeed - The speed at which the end boss jumps.
     * @param {number} gravity - The gravity affecting the end boss.
     */
    executeJump(maxJumpHeight, maxJumpDistance, jumpSpeed, gravity) {
        const jumpInterval = setInterval(() => {
            if (this.jumpingProgress < maxJumpHeight && this.jumpingUp) {
                this.jumpUp(jumpSpeed, maxJumpDistance, maxJumpHeight);
            } else {
                this.fallDown(gravity, maxJumpDistance, maxJumpHeight, jumpInterval);
            }
        }, 1000 / 60);
    }

    /**
     * Handles the upward movement of the jump.
     * @param {number} jumpSpeed - The speed at which the end boss jumps.
     * @param {number} maxJumpDistance - The maximum distance the end boss can jump.
     * @param {number} maxJumpHeight - The maximum height the end boss can jump.
     */
    jumpUp(jumpSpeed, maxJumpDistance, maxJumpHeight) {
        this.pos_y -= jumpSpeed;
        this.updateJumpPosition(maxJumpDistance, maxJumpHeight, jumpSpeed);
        this.jumpingProgress += jumpSpeed;
        if (this.jumpingProgress >= maxJumpHeight) {
            this.jumpingUp = false;
        }
    }

    /**
     * Handles the downward movement of the jump.
     * @param {number} gravity - The gravity affecting the end boss.
     * @param {number} maxJumpDistance - The maximum distance the end boss can jump.
     * @param {number} maxJumpHeight - The maximum height the end boss can jump.
     * @param {number} jumpInterval - The interval ID to clear.
     */
    fallDown(gravity, maxJumpDistance, maxJumpHeight, jumpInterval) {
        this.pos_y += gravity;
        this.updateJumpPosition(maxJumpDistance, maxJumpHeight, gravity);
        if (this.pos_y >= 140) {
            this.landJump(jumpInterval);
        }
    }

    /**
     * Updates the x position of the end boss during the jump.
     * @param {number} maxJumpDistance - The maximum distance the end boss can jump.
     * @param {number} maxJumpHeight - The maximum height the end boss can jump.
     * @param {number} speed - The speed at which the end boss moves.
     */
    updateJumpPosition(maxJumpDistance, maxJumpHeight, speed) {
        if (this.otherDirection) {
            this.pos_x += maxJumpDistance / (maxJumpHeight / speed);
        } else {
            this.pos_x -= maxJumpDistance / (maxJumpHeight / speed);
        }
    }

    /**
     * Handles the end boss landing after the jump.
     * @param {number} jumpInterval - The interval ID to clear.
     */
    landJump(jumpInterval) {
        this.pos_y = 140;
        this.jumpingProgress = 0;
        this.jumpingUp = true;
        clearInterval(jumpInterval);
        this.jumpExecuted = true;
        this.jumpInProgress = false;
    }

    /**
     * Handles taking damage for the end boss.
     * @param {Endboss} endboss - The end boss instance.
     */
    takeDamage() {
        let currentTime = Date.now();
        if (currentTime - this.lastDamageTime < this.damageCooldown) {
            return;
        }
        this.lastDamageTime = currentTime;
        this.looseEnergy();
        if (world && sound) {
            world.chicken_dead_sound.play();
        }
        this.animateHurtsEndboss();
        world.statusBarEndboss.setPercentageEndbossHealth(this.energy);
    }

    /**
     * Reduces the energy of the end boss.
     */
    looseEnergy() {
        this.energy -= 20;
    }

    /**
     * Animates the end boss getting hurt.
     */
    animateHurtsEndboss() {
        let index = 0;
        const interval = setInterval(() => {
            if (index < this.IMAGES_HURT_ENDBOSS.length) {
                this.playAnimation([this.IMAGES_HURT_ENDBOSS[index]]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 300);
    }

    /**
     * Checks if the end boss has no energy left.
     * @returns {boolean} True if the end boss has no energy, false otherwise.
     */
    checkNoEnergy() {
        return this.energy <= 0;
    }

    /**
     * Initializes the dead animation for the end boss.
     * @param {Endboss} endboss - The end boss instance.
     */
    initDeadAnimationEndboss() {
        let index = 0;
        const interval = setInterval(() => {
            if (wonGame) {
                if (index < this.IMGAGES_DEAD_ENDBOSS.length) {
                    this.playAnimation(this.IMGAGES_DEAD_ENDBOSS);
                    index++;
                    if (world && index === 2) {
                        clearInterval(interval);
                        world.stopAllAnimations();
                        setTimeout(() => world.quitGame(), 1000);
                    }
                }
            }
            animationIntervals.push(interval);
        }, 100);
    }

    /**
     * Enters the hurt state for the end boss.
     */
    enterHurtState() {
        this.isHurt = true;
        this.previousImages = this.currentImages;
        this.currentImages = this.IMAGES_HURT;
        this.currentImageIndex = 0;
    }

    /**
     * Resets the hit status for the end boss.
     */
    resetHitStatus() {
        this.hasBeenHit = false;
    }
}
