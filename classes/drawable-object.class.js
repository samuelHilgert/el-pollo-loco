class DrawableObject {
    img;
    imageCache = {};
    currentImage = 0;
    pos_x = 120;
    pos_y = 360;
    height = 150;
    width = 100;

    /**
     * Loads an image from the specified path and sets it as the object's image.
     * @param {string} path - The path to the image file.
     */
    loadImg(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Loads multiple images from an array of paths and caches them.
     * @param {string[]} arr - An array of paths to the image files.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the object's current image on the canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.pos_x, this.pos_y, this.width, this.height);
    }

    /**
     * Draws a blue frame around the object on the canvas context.
     * Only applies to instances of Character, Chicken, Endboss, Coins, or Bottles.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    drawFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss || this instanceof Coins || this instanceof Bottles) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.pos_x, this.pos_y, this.width, this.height);
            ctx.stroke();
        }
    }
}
