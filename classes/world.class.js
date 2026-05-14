/**
 * Central game world. Owns the canvas, the character, the active level and all
 * game loops (rendering, collision detection, sounds, etc.).
 */
class World {
    /** @type {Character} The playable character. */
    character = new Character();
    /** @type {Bottle[]} Bottles currently in flight (after being thrown). */
    bottles = []
    /** @type {Level} The currently loaded level. */
    level = level1;
    /** @type {HTMLCanvasElement} The canvas the world is rendered to. */
    canvas;
    /** @type {CanvasRenderingContext2D} The canvas rendering context. */
    ctx;
    /** @type {Keyboard} Reference to the shared keyboard input. */
    keyboard;
    /** @type {number} Current horizontal camera offset (negative scrolls right). */
    cameraX = 0;

    /** @type {number} Handle of the current requestAnimationFrame call. */
    myAnimationFrame;

    /**
     * Initialises canvas context, HUD assets, sounds, references and starts all game loops.
     * @param {HTMLCanvasElement} canvas - The canvas to render to.
     * @param {Keyboard} keyboard - Shared keyboard input state.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.hud = new HudRenderer(this);
        this.setAudios();
        this.setWorld();
        this.draw();
        this.run();
        this.backgroundMusic.play();
    }

    /**
     * Initialises all audio assets used by the world.
     */
    setAudios() {
        this.collectSound = new Audio('assets/audio/collect.mp3');
        this.throwSound = new Audio('assets/audio/throw-bottle.mp3');
        this.splashSound = new Audio('assets/audio/splash.mp3');
        this.chickenDieSound = new Audio('assets/audio/chicken-die.mp3');
        this.chickenAlertSound = new Audio('assets/audio/chicken-alert.mp3');
        this.chickenAlertSound.volume = 0.9;
        this.backgroundMusic = new Audio('assets/audio/background-music.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.8;
    }

    /**
     * Wires the world reference into all game objects that need access to it.
     */
    setWorld() {
        this.character.world = this;
        this.level.chickens.forEach(c => c.world = this);
        this.level.endboss.forEach(e => e.world = this);
    }

    /**
     * Main render loop. Clears the canvas, draws all objects and requests the next frame.
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawWorldLayer();
        this.drawHudLayer();
        this.myAnimationFrame = requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws the camera-translated world (background + dynamic objects).
     * The camera offset is rounded to whole pixels so adjacent background
     * tiles don't leave sub-pixel seams on high-DPI / mobile displays.
     */
    drawWorldLayer() {
        const camX = Math.round(this.cameraX);
        this.ctx.translate(camX, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.setObjects();
        this.ctx.translate(-camX, 0);
    }

    /**
     * Draws the fixed HUD (status bars and counters), unaffected by the camera.
     */
    drawHudLayer() {
        this.addObjectsToMap(this.level.statusBars);
        this.hud.drawCounters();
    }

    /**
     * Draws all dynamic objects (enemies, clouds, bottles, character, collectables).
     */
    setObjects() {
        this.addObjectsToMap(this.level.chickens);
        this.addObjectsToMap(this.level.endboss);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.bottles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
    }

    /**
     * Freezes the world immediately, plays the win/lose sound and shows the
     * end screen after a short delay. During the delay nothing moves but
     * sounds keep playing.
     */
    stopGame() {
        this.freezeWorld();
        this.backgroundMusic.pause();
        const hasWon = this.character.health > 0;
        this.playEndingSound(hasWon);
        setTimeout(() => {
            if (world !== this) return;
            initGameEnding(hasWon);
        }, 800);
    }

    /**
     * Cancels every per-frame loop and behaviour timer so the scene freezes
     * in place. Sounds keep playing; cleanup of those happens on game end.
     */
    freezeWorld() {
        cancelAnimationFrame(this.myAnimationFrame);
        clearInterval(this.runInterval);
        clearInterval(this.character?.keyInterval);
        this.level.chickens.forEach(c => clearInterval(c.followInterval));
        this.level.endboss.forEach(e => {
            clearInterval(e.movementInterval);
            clearTimeout(e.stateChangeTimeout);
            clearTimeout(e.hurtTimeout);
        });
    }

    /**
     * Plays the chicken-die sound on a win. The character's hurt sound on
     * lose is fired earlier (in `Character.applyDeath`) so it stays in sync
     * with the death animation.
     * @param {boolean} hasWon - Whether the player won.
     */
    playEndingSound(hasWon) {
        if (!hasWon || !this.chickenDieSound) return;
        this.chickenDieSound.currentTime = 0;
        this.chickenDieSound.play();
    }

    /**
     * Starts the 60 FPS logic loop (collisions, item pickups).
     */
    run() {
        this.runInterval = setInterval(() => {
            this.collisionCharacterWithEnemy();
            this.collisionBottleWithEnemy();
            this.characterCollectsBottle();
            this.characterCollectsCoin();
        }, 1000 / 60);
    }

    /**
     * Handles all character vs. enemy collisions (chickens and endboss).
     */
    collisionCharacterWithEnemy() {
        this.handleChickenCollisions();
        this.handleEndbossCollisions();
    }

    /**
     * Resolves character-vs-chicken collisions, detecting stomps and applying damage otherwise.
     */
    handleChickenCollisions() {
        let didStomp = false;
        this.level.chickens.forEach((chicken) => {
            if (!this.character.isColliding(chicken) || chicken.health === 0) return;
            if (this.character.isStompingOn(chicken)) {
                chicken.health = 0;
                didStomp = true;
                this.removeChickenAfterDelay(chicken);
            } else {
                this.character.getHurted(0, 20);
            }
        });
        if (didStomp) this.character.speedY = 10;
    }

    /**
     * Schedules a defeated chicken to be removed from the level after 3 seconds,
     * so its death sprite has time to show before it disappears.
     * @param {Chicken} chicken - The defeated chicken to remove.
     */
    removeChickenAfterDelay(chicken) {
        setTimeout(() => {
            this.level.chickens = this.level.chickens.filter(c => c !== chicken);
        }, 3000);
    }

    /**
     * Damages the character on every endboss collision.
     */
    handleEndbossCollisions() {
        this.level.endboss.forEach((endboss) => {
            if (this.character.isColliding(endboss)) this.character.getHurted(0, 20);
        });
    }

    /**
     * Dispatches bottle vs. enemy collision detection for chickens and the endboss.
     */
    collisionBottleWithEnemy() {
        this.bottleWithChicken();
        this.bottleWithEndboss();
    }

    /**
     * Plays the splash sound from the beginning.
     */
    playSplashSound() {
        this.splashSound.currentTime = 0;
        this.splashSound.play();
    }

    /**
     * Handles bottle hits on chickens, removes the chicken after a short delay.
     */
    bottleWithChicken() {
        this.level.chickens.forEach((chicken) => {
            this.bottles.forEach((bottle) => {
                if (bottle.isColliding(chicken)) this.applyBottleHitOnChicken(bottle, chicken);
            });
        });
    }

    /**
     * Applies a bottle hit to a chicken: triggers the splash, kills it and removes it after a delay.
     * @param {Bottle} bottle - The bottle that hit.
     * @param {Chicken} chicken - The chicken that was hit.
     */
    applyBottleHitOnChicken(bottle, chicken) {
        bottle.bottleHits(chicken, () => this.removeBottle(bottle), () => this.playSplashSound());
        chicken.health = 0;
        this.removeChickenAfterDelay(chicken);
    }

    /**
     * Handles bottle hits on the endboss, removing the boss once its health reaches zero.
     */
    bottleWithEndboss() {
        this.level.endboss.forEach((endboss) => {
            this.bottles.forEach((bottle) => {
                if (bottle.isColliding(endboss)) this.applyBottleHitOnEndboss(bottle, endboss);
            });
        });
    }

    /**
     * Applies a bottle hit to the endboss: damages, plays the splash and removes the boss on death.
     * @param {Bottle} bottle - The bottle that hit.
     * @param {Endboss} endboss - The endboss that was hit.
     */
    applyBottleHitOnEndboss(bottle, endboss) {
        bottle.bottleHits(endboss, () => this.removeBottle(bottle), () => this.playSplashSound());
        endboss.getHurted(1, 10, 'endboss');
        if (endboss.health <= 0) {
            setTimeout(() => {
                this.level.endboss = this.level.endboss.filter(e => e !== endboss);
            }, 700);
        }
    }

    /**
     * Picks up collectable bottles when the character collides with them.
     */
    characterCollectsBottle() {
        this.level.bottles.forEach((bottle) => {
            if (bottle.isColliding(this.character)) {
                this.character.bottleAmount += 1;
                this.level.bottles = this.level.bottles.filter(b => b !== bottle);
                this.collectSound.currentTime = 0;
                this.collectSound.play();
            }
        });
    }

    /**
     * Picks up coins when the character collides with them.
     */
    characterCollectsCoin() {
        this.level.coins.forEach((coin) => {
            if (coin.isColliding(this.character) && !coin.collected) {
                coin.collected = true;
                this.character.coinsCollected += 1;
                coin.coinCollected();
                this.collectSound.currentTime = 0;
                this.collectSound.play();
                setTimeout(() => {
                    this.level.coins = this.level.coins.filter(c => c !== coin);
                }, 60);
            }
        });
    }

    /**
     * Spawns a thrown bottle when the throw key is pressed and ammo is available.
     */
    checkBottles() {
        if (this.keyboard.KEY_K && this.character.bottleAmount != 0) {
            let bottle = new Bottle(this.character.positionX, this.character.positionY, this.character.isCharacterFlipped);
            this.bottles.push(bottle);
            this.character.bottleAmount -= 1;
            this.character.lastMoveTime = Date.now();
            this.character.snoringSound.pause();
            this.character.snoringSound.currentTime = 0;
            this.throwSound.currentTime = 0;
            this.throwSound.play();
        }
    }

    /**
     * Removes a bottle from the active bottle list.
     * @param {Bottle} bottle - The bottle to remove.
     */
    removeBottle(bottle) {
        this.bottles = this.bottles.filter(b => b !== bottle);
    }

    /**
     * Draws an array of objects to the canvas.
     * @param {DrawableObject[]} objects - The objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o)
        });
    }

    /**
     * Draws a single object, handling horizontal flipping if required.
     * @param {DrawableObject} mo - The object to draw.
     */
    addToMap(mo) {
        this.flipCharacter(mo);
        mo.draw(this.ctx);
        this.undoFlipCharacter(mo);
    }

    /**
     * Mirrors the canvas context horizontally so the sprite can be drawn flipped.
     * @param {DrawableObject} mo - The object that may be flipped.
     */
    flipCharacter(mo) {
        if (mo.isCharacterFlipped) {
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.positionX = mo.positionX * -1;
        }
    }

    /**
     * Restores the canvas context after a flipped draw call.
     * @param {DrawableObject} mo - The object that was flipped.
     */
    undoFlipCharacter(mo) {
        if (mo.isCharacterFlipped) {
            mo.positionX = mo.positionX * -1;
            this.ctx.restore();
        }
    }

}
