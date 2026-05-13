/**
 * Salsa bottle — either a collectable laying on the ground or a thrown projectile.
 * Constructor arguments switch the bottle into throw mode.
 * @extends MoveableObject
 */
class Bottle extends MoveableObject {

    /** @type {string[]} Frames for the rotation animation while flying. */
    IMAGES_ROTATION = [
        'assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png',
        'assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png'
    ];

    /** @type {string[]} Frames for the splash animation on impact. */
    IMAGES_SPLASH = [
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png',
        'assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png'
    ];

    positionX = (Math.random() * 4000) + 200;
    positionY = 520;

    width = 120;
    height = 120;

    offsetX = 30;
    offsetY = 6;
    offsetW = 60;
    offsetH = 12;

    /**
     * Creates a new bottle. If x and y are provided, the bottle is thrown from that position.
     * Otherwise it acts as a static collectable.
     * @param {number} [x] - X position to throw the bottle from.
     * @param {number} [y] - Y position to throw the bottle from.
     * @param {boolean} [flipped] - Whether the throwing character faces left.
     */
    constructor(x, y, flipped) {
        super();
        this.loadImage(this.IMAGES_ROTATION[0]);
        this.loadImages(this.IMAGES_ROTATION);
        this.loadImages(this.IMAGES_SPLASH);
        if (x !== undefined && y !== undefined) {
            this.throwBottle(x, y, flipped);
        }
    }

    /**
     * Initiates the throw trajectory, applies gravity and starts the rotation animation.
     * @param {number} x - Starting X position (character position).
     * @param {number} y - Starting Y position (character position).
     * @param {boolean} flipped - True if thrown to the left, false to the right.
     */
    throwBottle(x, y, flipped) {
        this.positionX = flipped ? (x - 60) : (x + 60);
        this.positionY = y;
        this.speedY = 10;
        this.applyGravity();
        this.animate(50, this.IMAGES_ROTATION);
        this.throwInterval = setInterval(() => {
            this.positionX += flipped ? -10 : 10;
        }, 1000 / 60);
    }

    /**
     * Handles a hit on an enemy: aligns the bottle with the enemy, plays the splash animation
     * and triggers the splash sound. Calls onDone after the animation completes.
     * @param {MoveableObject} enemy - The enemy that was hit.
     * @param {Function} onDone - Callback executed once the splash animation finishes.
     * @param {Function} [onSplash] - Optional callback executed at the moment of impact (sound).
     */
    bottleHits(enemy, onDone, onSplash) {
        if (this.hasHit) return;
        this.hasHit = true;

        const targetX = enemy.positionX + ((enemy.width / 4) - (this.width / 4));

        clearInterval(this.throwInterval);
        this.throwInterval = setInterval(() => {
            if (this.positionX < targetX) {
                this.positionX += 10;
            } else {
                clearInterval(this.throwInterval);
                if (onSplash) onSplash();
                this.animateOnce(100, this.IMAGES_SPLASH, onDone);
                this.speedY = 0;
                this.acceleration = 0;
            }
        }, 1000 / 60);
    }
}
