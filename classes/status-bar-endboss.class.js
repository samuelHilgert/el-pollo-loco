class StatusBarEndboss extends DrawableObject {

    IMAGES_ENDBOSS_HEALTH = [
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue0.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue20.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue80.png',
        'assets/img/7_statusbars/2_statusbar_endboss/blue/blue100.png'
    ];
    
    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.IMAGES_ENDBOSS_HEALTH);
        this.pos_x = 470;
        this.pos_y = 68;
        this.width = 250;
        this.height = 70;
        this.setPercentageEndbossHealth(100);
    }

    /**
     * Sets the percentage of the end boss's health on the status bar and updates the displayed image.
     * @param {number} percentage - The percentage to set on the status bar.
     */
    setPercentageEndbossHealth(percentage) {
        this.percentage = percentage;
        let path = this.IMAGES_ENDBOSS_HEALTH[this.resolveImageIndexEndbossHealth()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves the image index based on the current health percentage.
     * @returns {number} - The index of the image corresponding to the current health percentage.
     */
    resolveImageIndexEndbossHealth() {
        if (this.percentage == 100) {
            return 5;
        } else if (this.percentage >= 80) {
            return 4;
        } else if (this.percentage >= 60) {
            return 3;
        } else if (this.percentage >= 40) {
            return 2;
        } else if (this.percentage >= 20) {
            return 1;
        } else {
            return 0;
        } 
    }
}
