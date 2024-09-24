/**
 * Class representing coins in the game.
 * Extends the MovableObject class to inherit properties and methods for movement and drawing.
 */
class Coins extends MovableObject {
    height = 150;
    width = 150;

    IMAGES_COINS = [
        'assets/img/8_coin/coin_1.png',
        'assets/img/8_coin/coin_2.png'
    ];

    constructor() {
        super();
        this.loadImg(this.IMAGES_COINS[0]);
        this.loadImages(this.IMAGES_COINS);
        this.pos_x = 0;
        this.pos_y = 0;
        this.animateCoins();
    }

    /**
     * Generates a specified number of coins, evenly spaced apart.
     * 
     * @param {number} numberOfCoins - The number of coins to generate.
     * @param {number} distanceBetweenCoins - The distance between each coin.
     * @returns {Coins[]} An array of generated Coins objects.
     */
    static generateCoins(numberOfCoins, distanceBetweenCoins) {
        let coins = [];
        let xPos = 0;
        for (let i = 0; i < numberOfCoins; i++) {
            if (xPos >= 2410) break;
            let coin = new Coins();
            coin.pos_x = Math.floor(xPos + Math.random() * 300);
            coin.pos_y = Math.floor(50 + Math.random() * 100);
            coins.push(coin);
            xPos += distanceBetweenCoins + coin.width;
        }
        return coins;
    }

    /**
     * Animates the coins by cycling through their images at a set interval.
     */
    animateCoins() {
        const interval = setInterval(() => {
            this.playAnimation(this.IMAGES_COINS);
            animationIntervals.push(interval);
        }, 500);
    }
}
