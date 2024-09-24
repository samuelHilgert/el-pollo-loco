class Cloud extends MovableObject {
    width = 700;
    height = 450;
    
   constructor(x, f) {
        super().loadImg('assets/img/5_background/layers/4_clouds/1.png');
        if (f == 1) {
            this.pos_y = Math.random() * 10;
            this.pos_x = x + Math.random() * 300;
        } else {
            this.pos_y = Math.random() * 10;
            this.pos_x = x + this.width + Math.random() * 300;
        }
        this.animateClouds();
    }

    /**
     * Animates the cloud's movement to the left.
     */
    animateClouds() {
        const interval = setInterval(() => {
            this.moveLeft();
            animationIntervals.push(interval);
        }, 1000 / 60);
    }
}
