/**
 * Renders the HUD overlay (bottle and coin counters). Owns the icon images
 * and the actual ctx.drawImage / fillText calls so the World class can stay
 * focused on game state and orchestration.
 */
class HudRenderer {
    /**
     * @param {World} world - Reference to the world (needed for ctx + character state).
     */
    constructor(world) {
        this.world = world;
        this.bottleIcon = this.loadIcon('assets/img/7_statusbars/3_icons/icon_salsa_bottle.png');
        this.coinIcon   = this.loadIcon('assets/img/7_statusbars/3_icons/icon_coin.png');
    }

    /**
     * Helper to create an Image instance from a source path.
     * @param {string} src - Path to the icon image.
     * @returns {HTMLImageElement}
     */
    loadIcon(src) {
        const img = new Image();
        img.src = src;
        return img;
    }

    /**
     * Renders the HUD counters for bottle ammo and coin count.
     */
    drawCounters() {
        const visibleBottle = 80 - 20 - 20;
        const visibleCoin = 65 - 5 - 5;
        const textOffset = Math.max(visibleBottle, visibleCoin) + 10;
        const character = this.world.character;
        this.drawCounter(this.bottleIcon, character.bottleAmount, 50, 80, 80, 20, textOffset);
        this.drawCounter(this.coinIcon, character.coinsCollected, 50, 170, 65, 5, textOffset);
    }

    /**
     * Draws an icon plus its corresponding number on the HUD.
     * @param {HTMLImageElement} icon - The icon image.
     * @param {number} count - The number to display next to the icon.
     * @param {number} x - X position of the icon (before left padding).
     * @param {number} y - Y position of the icon.
     * @param {number} size - Width/height of the icon.
     * @param {number} leftPad - Horizontal padding subtracted from x.
     * @param {number} textOffset - Horizontal offset for the count text.
     */
    drawCounter(icon, count, x, y, size, leftPad, textOffset) {
        const ctx = this.world.ctx;
        ctx.drawImage(icon, x - leftPad, y, size, size);
        const textX = x + textOffset;
        const textY = y + size / 2 + 11;
        ctx.font = 'bold 32px Arial';
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'black';
        ctx.strokeText(count, textX, textY);
        ctx.fillStyle = 'white';
        ctx.fillText(count, textX, textY);
    }
}
