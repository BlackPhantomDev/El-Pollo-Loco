/**
 * Small variant of {@link Chicken} with smaller dimensions and its own sprite set.
 * @extends Chicken
 */
class BabyChicken extends Chicken {

    width = 60;
    height = 54;

    offsetX = 6;
    offsetY = 6;
    offsetW = 12;
    offsetH = 6;

    positionY = 571;

    /** @type {string[]} Frames for the walking animation. */
    IMAGES_WALKING = [
        'assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png',
        'assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png',
    ]

    /**
     * Loads baby-chicken sprites, starts the walking animation and the health check loop.
     */
    constructor() {
        super();
        this.loadImage('assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png');
        this.loadImages(this.IMAGES_WALKING);
        this.loadImages(['assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png']);
        this.animate(150, this.IMAGES_WALKING);
        this.checkHealth();
    }

    /**
     * Polls health and swaps to the dead sprite once health reaches zero.
     * Overrides {@link Chicken#checkHealth} to use the small-chicken death sprite.
     */
    checkHealth() {
        setInterval(() => {
            if (this.health == 0 && !this.isDead) {
                this.isDead = true;
                clearInterval(this.animationInterval);
                this.img = this.imageCache['assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png'];
                this.speed = 0;
            }
        }, 10);
    }
}
