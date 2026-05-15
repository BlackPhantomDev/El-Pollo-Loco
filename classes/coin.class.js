/**
 * Collectable coin. Position is randomised when the object is created.
 * @extends DrawableObject
 */
class Coin extends DrawableObject {
    width = 120;
    height = 120;

    positionX = (Math.random() * 4000) + 200;
    positionY = (Math.random() * 300) + 240;

    offsetX = 40;
    offsetY = 40;
    offsetW = 80;
    offsetH = 80;

    /**
     * Loads the default coin sprite.
     */
    constructor() {
        super();
        this.loadImage('assets/img/8_coin/coin_1.png');
    }

    /**
     * Swaps the sprite to the "collected" variant once the coin is picked up.
     */
    coinCollected() {
        this.loadImage('assets/img/8_coin/coin_2.png');
    }
}
