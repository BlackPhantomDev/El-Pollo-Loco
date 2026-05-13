/**
 * Base class for all drawable objects in the game.
 * Provides basic functionality for loading images, drawing and collision detection.
 */
class DrawableObject {
    /** @type {HTMLImageElement} The currently displayed image. */
    img;

    /** @type {number} Y position of the object on the canvas. */
    positionY;
    /** @type {number} X position of the object on the canvas. */
    positionX;

    /** @type {number} Width of the object in pixels. */
    width;
    /** @type {number} Height of the object in pixels. */
    height;

    /** @type {Object.<string, HTMLImageElement>} Cache of pre-loaded images (path -> Image). */
    imageCache = {};
    /** @type {number} Index of the current animation frame. */
    currentImage = 0;

    /**
     * Loads a single image and assigns it to {@link img}.
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Pre-loads a list of images into the {@link imageCache}.
     * @param {string[]} arr - Array of image file paths.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws the object onto the given canvas rendering context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.positionX, this.positionY, this.width, this.height);
    }

    /**
     * Checks whether this object collides with another object.
     * Optional offset properties (offsetX/Y/W/H) are used to shrink the hitbox.
     * @param {DrawableObject} mo - The other object to check against.
     * @returns {boolean} True if the hitboxes overlap.
     */
    isColliding(mo) {
        const aX = this.positionX + (this.offsetX ?? 0);
        const aY = this.positionY + (this.offsetY ?? 0);
        const aW = this.width  - (this.offsetW ?? 0);
        const aH = this.height - (this.offsetH ?? 0);

        const bX = mo.positionX + (mo.offsetX ?? 0);
        const bY = mo.positionY + (mo.offsetY ?? 0);
        const bW = mo.width  - (mo.offsetW ?? 0);
        const bH = mo.height - (mo.offsetH ?? 0);

        return  aX + aW > bX &&
                aY + aH > bY &&
                aX < bX + bW &&
                aY < bY + bH;
    }
}
