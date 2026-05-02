class MoveableObject extends DrawableObject {

    health = 100;
    
    speed;
    speedY;
    world;

    acceleration = 1;

    isCharacterFlipped;

    IMAGES_HURT = []
    IMAGES_DEAD = []

    applyGravity() {
        setInterval(() => {
            if (this.isAboveGround() || this.speedY > 0) {
                this.positionY -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }, 1000 / 25);
    }
    
    isAboveGround() {
        if (this instanceof Bottle) return true;
        else return this.positionY < 430;
    }

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

    animate(interval, animationArray) {
        clearInterval(this.animationInterval);
        this.animationInterval = setInterval(() => {
            let i = this.currentImage % animationArray.length;
            let path = animationArray[i];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, interval);
    }

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

    getHurted(i, p, barType = 'health') {
        if (!this.cooldown('collision', 1200)) return;
        
        const healthBar = this.world.level.statusBars[i];
        if (this.health > p) { 
            this.health -= p;
            healthBar.updatePercentage(p, barType);
            this.animateOnce(150, this.IMAGES_HURT);
        } else {
            this.dead();
            this.health = 0;
            healthBar.updatePercentage(0, barType);
        }
    }

    dead() {
        this.animateOnce(150, this.IMAGES_DEAD);
    }

}