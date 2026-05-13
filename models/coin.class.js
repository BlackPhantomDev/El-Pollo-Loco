class Coin extends DrawableObject {
    width = 120;
    height = 120;

    positionX = (Math.random() * 4000) + 200;
    positionY = (Math.random() * 300) + 240;

    offsetX = 36;
    offsetY = 36;
    offsetW = 72;
    offsetH = 72;

    constructor() {
        super();
        this.loadImage('assets/img/8_coin/coin_1.png');
    }
    
    coinCollected() {
        this.loadImage('assets/img/8_coin/coin_2.png');
    }
}