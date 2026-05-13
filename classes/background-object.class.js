/**
 * Static background tile that makes up the parallax layers of the level.
 * @extends MoveableObject
 */
class BackgroundObject extends MoveableObject{

    width = 1080;
    height = 720;

    /**
     * Creates a background tile at the given position.
     * positionY is offset so that y refers to the bottom edge of the tile.
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - X position of the tile.
     * @param {number} y - Y position (bottom edge) of the tile.
     */
    constructor(imagePath, x, y) {
        super();
        this.loadImage(imagePath);
        this.positionX = x;
        this.positionY = y - this.height;
    }
}
