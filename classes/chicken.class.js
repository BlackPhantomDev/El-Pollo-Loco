/**
 * Standard enemy chicken that walks left and can be defeated by stomping or bottle hits.
 * @extends MoveableObject
 */
class Chicken extends MoveableObject {

    width = 96;
    height = 96;

    offsetX = 6;
    offsetY = 6;
    offsetW = 12;
    offsetH = 6;

    positionY = 534;
    positionX = 450 + (Math.random() * 4000);

    /** @type {string[]} Frames for the walking animation. */
    IMAGES_WALKING = [
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
        "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
    ];

    /**
     * Loads images, randomises the walk speed and starts the movement & health check loops.
     */
    constructor() {
        super();
        this.loadImage('assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(['assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png']);
        this.animate(150, this.IMAGES_WALKING);
        this.speed = 0.15 + (Math.random() * 0.25);
        this.moveLeft();
        this.checkHealth();
    }

    /**
     * Polls health and swaps to the dead sprite once health reaches zero.
     */
    checkHealth() {
        setInterval(() => {
            if (this.health == 0 && !this.isDead) {
                this.speed = 0;
                this.isDead = true;
                clearInterval(this.animationInterval);
                setTimeout(() => {
                    this.img = this.imageCache['assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png'];
                }, 100);
            }
        }, 10);
    }

}
