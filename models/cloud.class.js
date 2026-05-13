/**
 * Decorative cloud that constantly drifts to the left.
 * @extends MoveableObject
 */
class Cloud extends MoveableObject {
    positionX = 250 + (Math.random() * 5000);
    positionY = 50;
    width = 540;
    height = 240;
    speed = 0.2;

    /**
     * Loads the cloud sprite and starts the drifting animation.
     */
    constructor() {
        super();
        this.loadImage('assets/img/5_background/layers/4_clouds/1.png');
        this.animate()
    }

    /**
     * Starts the leftward movement loop.
     */
    animate() {
        this.moveLeft();
    }
}
