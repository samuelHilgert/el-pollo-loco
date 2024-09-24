class Level { 
    enemies;
    clouds;
    baseImgForBgTypeOne;
    baseImgForBgTypeTwo;
    level_end_pos_x = 2500;

    constructor(enemies, clouds, baseImgForBgTypeOne, baseImgForBgTypeTwo) {
        this.enemies = enemies;
        this.clouds = clouds;
        this.baseImgForBgTypeOne = baseImgForBgTypeOne;
        this.baseImgForBgTypeTwo = baseImgForBgTypeTwo;
    }
}
