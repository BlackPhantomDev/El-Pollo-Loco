class Coin extends DrawableObject {
    width = 100;
    height = 100;

    positionX = (Math.random() * 4000) + 200;
    positionY = (Math.random() * 300) + 240;

    offsetX = 30;
    offsetY = 30;
    offsetW = 60;
    offsetH = 60;

    constructor() {
        super();
        this.loadImage('assets/img/8_coin/coin_1.png');
    }
    
    coinCollected() {
        this.loadImage('assets/img/8_coin/coin_2.png');
    }
}