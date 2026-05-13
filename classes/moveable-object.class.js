/**
 * Base class for all moveable game objects.
 * Extends {@link DrawableObject} with movement, gravity, animation, hit handling and death logic.
 * @extends DrawableObject
 */
class MoveableObject extends DrawableObject {

    /** @type {number} Current health value (0 - 100). */
    health = 100;

    /** @type {number} Horizontal movement speed. */
    speed;
    /** @type {number} Current vertical speed (used for gravity / jumping). */
    speedY;
    /** @type {World} Reference to the surrounding world instance. */
    world;

    /** @type {number} Gravity acceleration value applied per tick. */
    acceleration = 1;

    /** @type {boolean} Whether the sprite should be rendered horizontally flipped. */
    isCharacterFlipped;

    /** @type {string[]} Image paths for the hurt animation. */
    IMAGES_HURT = []
    /** @type {string[]} Image paths for the death animation. */
    IMAGES_DEAD = []

    /**
     * Starts a gravity loop that reduces positionY while the object is in the air.
     */
    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.positionY -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }

    /**
     * Determines whether the object is currently above the ground.
     * Bottles are always treated as airborne so gravity affects them in flight.
     * @returns {boolean} True if the object is above ground level.
     */
    isAboveGround() {
        if (this instanceof Bottle) return true;
        else return this.positionY < 390;
    }

    /**
     * Starts continuous movement to the right.
     */
    moveRight() {
        setInterval(() => {
            this.positionX += this.speed;
        }, 1000 / 60);
    }

    /**
     * Starts continuous movement to the left.
     */
    moveLeft() {
        setInterval(() => {
            this.positionX -= this.speed;
        }, 1000 / 60);
    }

    /**
     * Plays a looping animation from a given array of image paths.
     * @param {number} interval - Time in milliseconds between frames.
     * @param {string[]} animationArray - Array of image paths to cycle through.
     */
    animate(interval, animationArray) {
        clearInterval(this.animationInterval);
        this.animationInterval = setInterval(() => {
            let i = this.currentImage % animationArray.length;
            let path = animationArray[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, interval);
    }

    /**
     * Plays an animation once and executes an optional callback when it finishes.
     * @param {number} interval - Time in milliseconds between frames.
     * @param {string[]} animationArray - Array of image paths to play once.
     * @param {Function} [onDone] - Optional callback invoked after the last frame.
     */
    animateOnce(interval, animationArray, onDone) {
        clearInterval(this.animationInterval);
        let i = 0;
        this.animationInterval = setInterval(() => {
            this.img = this.imageCache[animationArray[i]];
            i++;
            if (i >= animationArray.length) {
                clearInterval(this.animationInterval);
                if (onDone) onDone();
            }
        }, interval);
    }

    /**
     * Generic cooldown helper. Returns true if the given key is ready to be triggered again.
     * @param {string} key - Identifier for the cooldown bucket.
     * @param {number} ms - Cooldown duration in milliseconds.
     * @returns {boolean} True if the action can be performed, false if still cooling down.
     */
    cooldown(key, ms) {
        const now = Date.now();
        if (!this._cooldowns) this._cooldowns = {};
        if (now - (this._cooldowns[key] ?? 0) < ms) return false;
        this._cooldowns[key] = now;
        return true;
    }

    /**
     * Reduces health, updates the status bar and triggers the hurt/death animation.
     * @param {number} i - Index of the status bar in world.level.statusBars.
     * @param {number} p - Amount of damage to apply.
     * @param {string} [barType='health'] - Type of status bar to update ('health' | 'endboss' | ...).
     */
    getHurted(i, p, barType = 'health') {
        if (!this.cooldown('collision', 1200)) return;
        const statusBar = this.world.level.statusBars[i];
        if (this.health > 10) this.applyDamage(statusBar, i, p, barType);
        else this.applyDeath(statusBar, barType);
    }

    /**
     * Applies damage: reduces health, updates status bar and plays the hurt animation.
     * @param {StatusBar} statusBar - The status bar to update.
     * @param {number} i - Index of the status bar (0 = character, 3 = endboss).
     * @param {number} p - Amount of damage to apply.
     * @param {string} barType - Type of status bar to update.
     */
    applyDamage(statusBar, i, p, barType) {
        this.health -= p;
        statusBar.updatePercentage(p, barType);
        this.animateOnce(150, this.IMAGES_HURT);
        if (i == 0) this.characterGetHurted();
        else if (i == 3) this.endbossGetHurted();
    }

    /**
     * Applies a fatal hit: zeroes health, empties the status bar and triggers the death animation.
     * @param {StatusBar} statusBar - The status bar to zero out.
     * @param {string} barType - Type of status bar to update.
     */
    applyDeath(statusBar, barType) {
        this.health = 0;
        statusBar.percentage = 0;
        statusBar.updateStatusBar(barType);
        this.dead(this);
    }

    /**
     * Plays the death animation and stops the game depending on the object type.
     * @param {MoveableObject} obj - The object that died (Character or Endboss).
     */
    dead(obj) {
        if (obj instanceof Endboss) {
            this.animateOnce(150, this.IMAGES_DEAD, () => this.world.stopGame(true));
        }
        if (obj instanceof Character) {
            this.animateOnce(150, this.IMAGES_DEAD, () => this.world.stopGame(false));
        }
    }

    /**
     * Restores the character's idle/walk animation a short time after being hurt.
     */
    characterGetHurted() {
        setTimeout(() => {
            if (this.checkWalkingKeys()) this.animate(100, this.IMAGES_WALK);
            else this.animate(150, this.IMAGES_IDLE);
        }, 600);
    }

    /**
     * Restores the endboss alert animation a short time after being hurt.
     */
    endbossGetHurted() {
        setTimeout(() => {
            this.animate(150, this.IMAGES_ALERT);
        }, 600);
    }
}
