function generateObjects() {
    const configs = [
        { array: clouds,  min: 5,  max: 10, factory: () => new Cloud() },
        { array: coins,   min: 15,  max: 20, factory: () => new Coin() },
        { array: bottles, min: 5,  max: 10, factory: () => new Bottle() },
    ];

    configs.forEach(({ array, min, max, factory }) => {
        for (let i = 0; i < randomAmount(min, max); i++) {
            array.push(factory());
        }
    });
}

function randomAmount(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

let enemies = [];

for (let i = 0; i < randomAmount(7, 15); i++) {
    const isChicken = Math.random() > 0.5;
    enemies.push(isChicken ? new Chicken() : new BabyChicken());
}

const endboss = [ new Endboss() ];
const clouds = [];


let background = [];

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

const statusBars = [
    new StatusBar('health', 100, 50, 0),
    new StatusBar('coin', 0, 50, 60),
    new StatusBar('bottle', 0, 50, 120),
    new StatusBar('endboss', 100, 730, 0),
];

let coins = [];

let bottles = [];

const level1 = new Level(enemies, endboss, clouds, background, statusBars, coins, bottles);

