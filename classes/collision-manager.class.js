class CollisionManager {

    constructor(world) {
        this.world = world;
    }

    /**
     * Checks for collisions between the character and enemies.
     */
    checkCollisionEnemy() {
        this.world.level.enemies.forEach((enemy) => {
            if (this.world.character.isColliding(enemy)) {
                this.handleCollisionWithEnemy(enemy);
            } else {
                this.handleNoCollisionWithEnemy(enemy);
            }
        });
    }

    /**
     * Handles logic when a collision with an enemy occurs.
     * @param {Object} enemy - The enemy object involved in the collision.
     */
    handleCollisionWithEnemy(enemy) {
        if (this.onlyPepeHurtsCondition(enemy)) {
            this.world.character.hit();
            this.world.statusBar.setPercentageHealth(this.world.character.energy);
        } else if (this.world.character.isAboveGround()) {
            this.setEnemiesHits(enemy);
            enemy.hasBeenHit = true;
            enemy.currentChicken = enemy;
        }
    }

    /**
     * Handles logic when no collision with an enemy occurs.
     * @param {Object} enemy - The enemy object not involved in the collision.
     */
    handleNoCollisionWithEnemy(enemy) {
        enemy.hasBeenHit = false;
        if (enemy.enemyType === 'endboss' && enemy.hasBeenHit) {
            enemy.resetHitStatus();
        }
    }

    /**
     * Checks if Pepe gets hurt when he is not jumping on top of the enemy.
     * @param {Object} enemy - The enemy object.
     * @returns {boolean} - True if Pepe should be hurt, false otherwise.
     */
    onlyPepeHurtsCondition(enemy) {
        return !this.world.character.isAboveGround() && !enemy.hasBeenHit;
    }

    /**
     * Sets the hit status for enemies based on their type.
     * @param {Object} enemy - The enemy object to set the hit status for.
     */
    setEnemiesHits(enemy) {
        if (!enemy.hasBeenHit) {
            if (enemy.enemyType == 'small' || enemy.enemyType == 'normal') {
                enemy.energyChicken -= 100;
            }
            if (sound) {
                this.world.chicken_dead_sound.play();
            }
        }
    }
}
