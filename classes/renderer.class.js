class Renderer {

    constructor(world) {
        this.world = world;
        this.ctx = world.canvas.getContext('2d');
    }

    /**
     * Draws all game elements on the canvas.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.world.canvas.width, this.world.canvas.height);
        this.ctx.translate(this.world.camera_pos_x, 0);
        this.generateObjects();
        this.ctx.translate(-this.world.camera_pos_x, 0);
        if (!gameOver) {
            this.generateFixedObjects();
        }
        this.ctx.translate(this.world.camera_pos_x, 0);
        this.generatePepe();
        this.ctx.translate(-this.world.camera_pos_x, 0);
        if (!gameOver) {
            this.drawLoop();
        }
    }

    /**
     * Draws the character (Pepe) on the canvas.
     */
    generatePepe() {
        if (!gameOver) {
            if (this.world.character) {
                this.addToMap(this.world.character);
            }
        }
    }

    /**
     * Draws all dynamic objects (background, clouds, enemies, coins, bottles) on the canvas.
     */
    generateObjects() {
        this.addObjectsToMap(this.world.backgroundObjects);
        this.addObjectsToMap(this.world.level.clouds);
        if (!gameOver) {
            if (this.world.character) {
                this.addToMap(this.world.character);
            }
            this.addObjectsToMap(this.world.level.enemies);
            this.addObjectsToMap(this.world.throwableObjects);
            this.addObjectsToMap(this.world.coins);
            this.addObjectsToMap(this.world.bottles);
        }
    }

    /**
     * Draws all fixed objects (status bars) on the canvas.
     */
    generateFixedObjects() {
        this.addToMap(this.world.statusBar);
        this.addToMap(this.world.statusBarBottle);
        this.addToMap(this.world.statusBarCoins);
        if (endbossBattleStatus && !gameOver) {
            this.addToMap(this.world.statusBarEndboss);
        }
    }

    /**
     * Adds multiple objects to the canvas.
     * @param {Array} objects - An array of objects to be added to the canvas.
     */
    addObjectsToMap(objects) {
        objects.forEach(xy => {
            this.addToMap(xy);
        });
    }

    /**
     * Adds a single object to the canvas.
     * @param {MovableObject} mo - The object to be added to the canvas.
     */
    addToMap(mo) {
        if (mo.otherDirection) {
            this.flipImage(mo);
        }
        mo.draw(this.ctx);
        if (mo.otherDirection) {
            this.flipImageBack(mo);
        }
    }

    /**
     * Flips the image of a movable object horizontally on the canvas context.
     * @param {MovableObject} mo - The object whose image is to be flipped.
     */
    flipImage(mo) {
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.pos_x = mo.pos_x * -1;
    }

    /**
     * Restores the image of a movable object to its original state after flipping.
     * @param {MovableObject} mo - The object whose image is to be restored.
     */
    flipImageBack(mo) {
        mo.pos_x = mo.pos_x * -1;
        this.ctx.restore();
    }

    /**
     * Continuously calls the draw method to create an animation loop.
     */
    drawLoop() {
        let self = this;
        requestAnimationFrame(function () {
            self.draw();
        });
    }
}
