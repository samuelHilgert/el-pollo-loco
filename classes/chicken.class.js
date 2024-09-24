class Chicken extends MovableObject {
    height = 70;
    width = 60;
    enemyType = 'small';
    isDead = false;
    hasBeenHit = false;

    IMAGES_WALKING_SMALL = [
        'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png'
    ];

    IMAGES_WALKING_NORMAL = [
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png'
    ];

    IMG_DEAD_SMALL = 'assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png';
    IMG_DEAD_NORMAL = 'assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png';

    constructor(size) {
        super();
        this.enemyType = size;
        this.energyChicken = 100;
        this.currentChicken;
        this.loadImg('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImg('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING_SMALL);
        this.loadImages(this.IMAGES_WALKING_NORMAL);
        this.pos_x = 1000 + Math.random() * 1000;
        this.speed = 0.15 + Math.random() * 0.5;
        this.monitoringChicken();
        this.animateChicken();
    }

    /**
    * Monitors the chicken's state and updates its animation if it is dead.
    */
    monitoringChicken() {
        const interval = setInterval(() => {
            if (this.energyChicken == 0) {
                this.deadAnimateChicken(this.currentChicken);
            }
            animationIntervals.push(interval);
        }, 90);
    }

    /**
     * Animates the chicken's movement and walking cycle.
     */
    animateChicken() {
        const intervalId1 = setInterval(() => {
            if (!this.energyChicken == 0) {
                this.moveLeft();
            }
            animationIntervals.push(intervalId1);
        }, 1000 / 60);

        const intervalId2 = setInterval(() => {
            if (this.enemyType == 'small') {
                this.playAnimation(this.IMAGES_WALKING_SMALL);
            } else if (this.enemyType == 'normal') {
                this.playAnimation(this.IMAGES_WALKING_NORMAL);
            }
            animationIntervals.push(intervalId2);
        }, 100);
    }

    /**
     * Handles the animation when the chicken is dead.
     * @param {Object} enemy - The enemy object to remove after the death animation.
     */
    deadAnimateChicken(enemy) {
        this.isDead = true;
        if (this.enemyType == 'small') {
            this.img.src = this.IMG_DEAD_SMALL;
        } else if (this.enemyType == 'normal') {
            this.img.src = this.IMG_DEAD_NORMAL;
        }
        const interval = setInterval(() => {
            world.removeEnemy(enemy);
            animationIntervals.push(interval);
        }, 1000);
    }
}
