class BackgroundGenerator {

    constructor(level, offset) {
        this.level = level;
        this.offset = offset;
        this.backgroundObjects = [];
        this.backgroundRepeat = 10;
    }

    /**
     * Generates the background objects by repeating type one and type two backgrounds.
     * @returns {Array} - An array of generated background objects.
     */
    generateBackground() {
        for (let index = 0; index < this.backgroundRepeat; index++) {
            this.backgroundTypeOne();
            this.backgroundTypeTwo();
        }
        return this.backgroundObjects;
    }

    /**
     * Generates background objects of type one and adds them to the backgroundObjects array.
     */
    backgroundTypeOne() {
        for (let i = 0; i < this.level.baseImgForBgTypeOne.length; i++) {
            this.backgroundObjects.push(new BackgroundObject(this.level.baseImgForBgTypeOne[i], this.offset));
        }
        this.offset += 749;
    }

    /**
     * Generates background objects of type two and adds them to the backgroundObjects array.
     */
    backgroundTypeTwo() {
        for (let i = 0; i < this.level.baseImgForBgTypeTwo.length; i++) {
            this.backgroundObjects.push(new BackgroundObject(this.level.baseImgForBgTypeTwo[i], this.offset));
        }
        this.offset += 749;
    }
}
