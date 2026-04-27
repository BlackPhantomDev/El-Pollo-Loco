class BackgroundObject extends MoveableObject{

    width = 1080;
    height = 720;

    constructor(imagePath, x, y) {
        super();
        this.loadImage(imagePath);
        this.positionX = x;
        this.positionY = y - this.height;
    }
}