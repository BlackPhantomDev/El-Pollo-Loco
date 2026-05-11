function randomAmount(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateObjects() {
    const configs = [
        { array: level1.clouds,  min: 5,  max: 10, factory: () => new Cloud() },
        { array: level1.coins,   min: 15,  max: 20, factory: () => new Coin() },
        { array: level1.bottles, min: 5,  max: 10, factory: () => new Bottle() },
    ];

    configs.forEach(({ array, min, max, factory }) => {
        for (let i = 0; i < randomAmount(min, max); i++) {
            array.push(factory());
        }
    });
}

const background = [];

const layers = [
    './assets/img/5_background/layers/air.png',
    './assets/img/5_background/layers/3_third_layer',
    './assets/img/5_background/layers/2_second_layer',
    './assets/img/5_background/layers/1_first_layer',
];

for (let x = -1080; x <= 5400; x += 1080) {
    const variant = (x / 1080) % 2 === 0 ? 2 : 1;
    layers.forEach((layer, i) => {
        const path = i === 0 ? `${layer}` : `${layer}/${variant}.png`;
        background.push(new BackgroundObject(path, x, 720));
    });
}

let level1;

function initLevel() {
    const enemies = [];
    for (let i = 0; i < randomAmount(7, 15); i++) {
        const isChicken = Math.random() > 0.5;
        enemies.push(isChicken ? new Chicken() : new BabyChicken());
    }

    const statusBars = [
        new StatusBar('health', 100, 50, 0),
        new StatusBar('endboss', 100, 730, 0),
    ];

    level1 = new Level(enemies, [new Endboss()], [], background, statusBars, [], []);
}
