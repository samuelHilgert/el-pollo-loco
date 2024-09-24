class MovableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    speedYGravity = 0;
    acceleration = 2;
    energy = 100;
    lastHit = 0;
    intervalIds = [];
    gotBottles = 0;
    gotCoins = 0;
    hit_sound = new Audio('assets/audio/hit.mp4');
    hitByBottleOneTime = 0;
    damageCooldown = false;

    /**
     * Moves the object to the right by its speed.
     */
    moveRight() {
        this.pos_x += this.speed;
        this.otherDirection = false;
    }

    /**
     * Moves the object to the left by its speed.
     */
    moveLeft() {
        this.pos_x -= this.speed;
    }

    /**
     * Makes the object jump by increasing its vertical speed.
     */
    jump() {
        if (!this.isAboveGround()) {
            this.speedYGravity = 25;
            this.isJumping = true;
            this.playJumpingAnimation();
        }
    }

    /**
    * Checks if there is a collision with another object.
    * @param {Object} mo - The object to check for a collision with, for example, an enemy.
    * @param {number} mo.pos_x - The x-position of the other object.
    * @param {number} mo.pos_y - The y-position of the other object.
    * @param {number} mo.width - The width of the other object.
    * @param {number} mo.height - The height of the other object.
    * @returns {boolean} - Returns true if a collision has occurred, false otherwise.
    */
    isColliding(mo) {
        return this.pos_x + this.width > mo.pos_x &&
            this.pos_y + this.height > mo.pos_y &&
            this.pos_x < mo.pos_x + mo.width &&
            this.pos_y < mo.pos_y + mo.height;
    }

    /**
     * Checks if the object is above the ground level.
     * Special handling for ThrowAbleObject instances: always returns true.
     * @returns {boolean} - Returns true if the object is above the ground level, 
     *                      or if the object is an instance of ThrowAbleObject. 
     *                      Otherwise, returns false.
     */
    isAboveGround() {
        if (this instanceof ThrowAbleObject) {
            return true;
        } else {
            return this.pos_y < 130;
        }
    }

    /**
     * Reduces the energy of the character by 5 units.
     * If the energy drops below 0, it is set to 0.
     * Updates the last hit time if the energy is still above 0.
     */
    hit() {
        if (!this.damageCooldown) {
            this.playHitSound();
            this.reduceEnergy();
            this.updateLastHitTime();
            this.startDamageCooldown();
        }
    }

    /**
     * Plays the hit sound if sound is enabled.
     */
    playHitSound() {
        if (sound) {
            this.hit_sound.play();
        }
    }

    /**
     * Reduces the energy of the character.
     * If setLooseCoinsPossible is true, also reduces gotCoins and updates the status bar.
     */
    reduceEnergy() {
        if (this.setLooseCoinsPossible) {
            this.energy -= 10;
            this.reduceCoins();
        } else {
            this.energy -= 10;
        }
        this.checkEnergyLevel();
    }

    /**
     * Reduces the number of coins the character has and updates the status bar.
     */
    reduceCoins() {
        if (this.gotCoins > 0) {
            this.gotCoins -= 20;
            this.world.statusBarCoins.setPercentageCoins(this.gotCoins);
            this.createCoinNearCharacter();
        }
    }

    /**
     * Checks the energy level of the character and sets it to 0 if it drops below 0.
     */
    checkEnergyLevel() {
        if (this.energy <= 0) {
            this.energy = 0;
        }
    }

    /**
     * Updates the last hit time of the character.
     */
    updateLastHitTime() {
        if (this.energy > 0) {
            this.lastHit = new Date().getTime();
        }
    }

    /**
     * Starts the damage cooldown period to prevent immediate consecutive hits.
     */
    startDamageCooldown() {
        this.damageCooldown = true;
        setTimeout(() => this.damageCooldown = false, 1000);
    }

    /**
     * Creates a coin near the character's current position.
     */
    createCoinNearCharacter() {
        let coin = new Coins();
        coin.pos_y = 300;
        coin.pos_x = this.world.character.pos_x + 200;
        this.world.coins.push(coin);
    }

    /**
     * Applies gravity to the object, making it fall over time.
     */
    applyGravity() {
        const interval = setInterval(() => {
            if (this.isAboveGround() || this.speedYGravity > 0) {
                this.pos_y -= this.speedYGravity;
                this.speedYGravity -= this.acceleration;
                if (this.pos_y >= 130) {
                    this.speedYGravity = 0;
                    this.pos_y = 130;
                    this.isJumping = false;
                }
            }
            animationIntervals.push(interval);
        }, 1000 / 25);
    }

    /**
     * Applies gravity to the bottles, making it fall over time.
     */
    applyGravityBottles() {
        const interval = setInterval(() => {
            if (this.isAboveGround() || this.speedYGravity > 0) {
                this.pos_y -= this.speedYGravity;
                this.speedYGravity -= this.acceleration;
            }
            animationIntervals.push(interval);
        }, 1000 / 25);
    }

    /**
     * Plays an animation by cycling through the provided images.
     * @param {string[]} images - An array of image paths to cycle through.
     */
    playAnimation(images) {
        let i = this.currentImage % images.length;
        let path = images[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Checks if the character is collecting coins.
     * @param {Object} mo - The coin object to check.
     * @returns {boolean} - Returns true if the character is collecting the coin, false otherwise.
     */
    isCollectingCoins(mo) {
        const characterTop = this.pos_y + 200;
        const characterBottom = characterTop + (this.height - 200);
        const characterRight = this.pos_x + (this.width - 100);
        const objectLeft = mo.pos_x;
        const objectRight = mo.pos_x + mo.width;
        const objectTop = mo.pos_y;
        const objectBottom = mo.pos_y + mo.height;
        const isOverlapX = this.pos_x < objectRight && characterRight > objectLeft;
        const isOverlapY = characterTop < objectBottom && characterBottom > objectTop;
        return isOverlapX && isOverlapY;
    }

    /**
     * Checks if the character is collecting bottles.
     * @param {Object} mo - The bottle object to check.
     * @returns {boolean} - Returns true if the character is collecting the bottle, false otherwise.
     */
    isCollectingBottles(mo) {
        return this.pos_x + this.width > mo.pos_x + mo.width && this.pos_y + this.height > mo.pos_y && this.pos_x < mo.pos_x && this.pos_y < mo.pos_y + mo.height;
    }

    /**
     * Checks if there is a collision with a bottle.
     * @param {Object} mo - The bottle object to check.
     * @returns {boolean} - Returns true if a collision has occurred, false otherwise.
     */
    isCollidingWidthBottle(mo) {
        return this.pos_x + this.width > mo.pos_x && this.pos_y + this.height > mo.pos_y && this.pos_x < mo.pos_x && this.pos_y < mo.pos_y + mo.height;
    }

    /**
     * Collects a bottle and updates the bottle count.
     * @param {Object} bottle - The bottle object to collect.
     */
    collectBottle(bottle) {
        if (this.gotBottles < 100) {
            let arr = world.bottles;
            this.gotBottles += 20;
            this.removeObjectByCollection(bottle, arr);
        }
    }

    /**
     * Removes an object from the specified collection.
     * @param {Object} object - The object to remove.
     * @param {Object[]} arr - The array to remove the object from.
     */
    removeObjectByCollection(object, arr) {
        const index = arr.indexOf(object);
        if (index > -1) {
            arr.splice(index, 1);
        }
    }

    /**
     * Collects a coin and updates the coin count.
     * @param {Object} coin - The coin object to collect.
     */
    collectCoin(coin) {
        if (this.gotCoins < 100) {
            let arr = world.coins;
            this.gotCoins += 20;
            this.removeObjectByCollection(coin, arr);
        }
    }

    /**
     * Checks for collisions between the bottle and enemies.
     * @param {Object[]} enemies - The array of enemies to check collisions with.
     */
    checkBottleCollision(enemies) {
        if (this.hitByBottleOneTime < 1) {
            if (enemies && enemies.length > 0) {
                enemies.forEach((enemy) => {
                    if (this.isColliding(enemy)) {
                        this.startBottleSplash(enemy);
                        this.hitByBottleOneTime++;
                    }
                });
            }
        }
    }

    /**
     * Checks if the object is dead.
     * @returns {boolean} - Returns true if the object is dead, false otherwise.
     */
    isDead() {
        return this.energy == 0;
    }

    /**
     * Checks if the object is hurt.
     * @returns {boolean} - Returns true if the object is hurt, false otherwise.
     */
    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit;
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }
}
