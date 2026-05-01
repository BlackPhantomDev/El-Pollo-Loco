class MoveableObject extends DrawableObject {

    health = 100;
    
    speed;
    world;

    isCharacterFlipped;

    IMAGES_HURT = []
    IMAGES_DEAD = []


    moveRight() {
        setInterval(() => {
            this.positionX += this.speed;
        }, 1000 / 60);
    }

    moveLeft() {
        setInterval(() => {
            this.positionX -= this.speed;
        }, 1000 / 60);
    }

    animate(interval, currentAnimationArray) {
        clearInterval(this.animationInterval);
        this.animationInterval = setInterval(() => {
            let i = this.currentImage % currentAnimationArray.length;
            let path = currentAnimationArray[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, interval);
    }

    drawColFrame(ctx) {
        if (this instanceof Character || this instanceof Chicken || this instanceof Endboss) {
            ctx.beginPath();
            ctx.lineWidth = '5';
            ctx.strokeStyle = 'blue';
            ctx.rect(this.positionX, this.positionY, this.width, this.height);
            ctx.stroke();
        }
    }
    
    cooldown(key, ms) {
        const now = Date.now();
        if (!this._cooldowns) this._cooldowns = {};
        if (now - (this._cooldowns[key] ?? 0) < ms) return false;
        this._cooldowns[key] = now;
        return true;
    }

    isColiding(mo) {
        return  this.positionX + this.width > mo.positionX &&
                this.positionY + this.height > mo.positionY &&
                this.positionX < mo.positionX &&
                this.positionY < mo.positionY + mo.height
    }

    getHurted(i, p) {
        const healthBar = this.world.level.statusBars[i];
        if (this.health > p) { 
            this.health -= p;
            healthBar.updatePercentage(p, 'health');
            this.animate(150, this.IMAGES_HURT);
        } else {
            this.dead();
            this.health = 0;
            healthBar.updatePercentage(p, 'health');
        }
        if (!this.cooldown('collision', 1200)) return;
    }

    dead(igs) {
        this.animate(150, this.IMAGES_DEAD)
    }

}