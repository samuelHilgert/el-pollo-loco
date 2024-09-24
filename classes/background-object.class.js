class BackgroundObject extends MovableObject { 
    width = 750;
    height = 480;
    
    constructor(path, x) {
        super().loadImg(path);
        this.pos_x = x;
        this.pos_y = 480 - this.height;
    }
}