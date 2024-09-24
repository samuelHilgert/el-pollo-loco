let level1 = null;

function createLevel() {
    level1 = new Level(
        [
            new Endboss(),
            new Chicken('small'),
            new Chicken('small'),
            new Chicken('small'),
            new Chicken('normal'),
            new Chicken('normal'),
            new Chicken('normal')

        ],
        [
            new Cloud(0, 1),
            new Cloud(800),
            new Cloud(1600),
            new Cloud(2400),
            new Cloud(3200),
            new Cloud(4000),
            new Cloud(4800),
            new Cloud(5600),
            new Cloud(6200),
            new Cloud(7000),
            new Cloud(7800)
        ],
        [
            'assets/img/5_background/layers/air.png',
            'assets/img/5_background/layers/3_third_layer/1.png',
            'assets/img/5_background/layers/2_second_layer/1.png',
            'assets/img/5_background/layers/1_first_layer/1.png'
        ],
        [
            'assets/img/5_background/layers/air.png',
            'assets/img/5_background/layers/3_third_layer/2.png',
            'assets/img/5_background/layers/2_second_layer/2.png',
            'assets/img/5_background/layers/1_first_layer/2.png'
        ]
    );
}
