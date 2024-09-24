class Bottles extends MovableObject {
    height = 100;
    width = 75;

    IMAGES_BOTTLES = [
        'assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png',
        'assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png'
    ];

    constructor() {
        super();
        this.loadImg(this.IMAGES_BOTTLES[0]);
        this.loadImages(this.IMAGES_BOTTLES);
        this.pos_x = 0;
        this.pos_y = 335;
        this.animateBottles();
    }

    /**
     * Generates a specified number of bottles, evenly spaced apart.
     * 
     * @param {number} numberOfBottles - The number of bottles to generate.
     * @param {number} distanceBetweenBottles - The distance between each bottle.
     * @returns {Bottles[]} An array of generated Bottles objects.
     */
    static generateBottles(numberOfBottles, distanceBetweenBottles) {
        let bottles = [];
        let xPos = 0;
        for (let i = 0; i < numberOfBottles; i++) {
            if (xPos >= 2410) break; 
            let bottle = new Bottles();
            bottle.pos_x = Math.floor(xPos + Math.random() * 300);
            bottles.push(bottle);
            xPos += distanceBetweenBottles + bottle.width;
        }
        return bottles;
    }
    
    /**
     * Animates the bottles by cycling through their images at a set interval.
     */
    animateBottles() {
        const interval = setInterval(() => {
            this.playAnimation(this.IMAGES_BOTTLES);
            animationIntervals.push(interval);
        }, 500);
    }
}