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
    
    cooldown(key, ms) {
        const now = Date.now();
        if (!this._cooldowns) this._cooldowns = {};
        if (now - (this._cooldowns[key] ?? 0) < ms) return false;
        this._cooldowns[key] = now;
        return true;
    }

    getHurted(i, p, barType = 'health') {
        if (!this.cooldown('collision', 1200)) return;
        const statusBar = this.world.level.statusBars[i];
        if (this.health > 10) { 
            this.health -= p;
            statusBar.updatePercentage(p, barType);
            this.animateOnce(150, this.IMAGES_HURT);
            if (i == 0) this.characterGetHurted();
            else if (i == 3) this.endbossGetHurted();
        } else {
            this.health = 0;
            statusBar.percentage = 0;
            statusBar.updateStatusBar(barType);
            this.dead(this);
        }
    }

    dead(obj) {
        if (obj instanceof Endboss) {
            this.animateOnce(150, this.IMAGES_DEAD, () => this.world.stopGame(true));
        }
        if (obj instanceof Character) {
            this.animateOnce(150, this.IMAGES_DEAD, () => this.world.stopGame(false));
        }
    }

    characterGetHurted() {
        setTimeout(() => {
            if (this.checkWalkingKeys()) this.animate(100, this.IMAGES_WALK);
            else this.animate(150, this.IMAGES_IDLE);
        }, 600);
    }

    endbossGetHurted() {
        setTimeout(() => {
            this.animate(150, this.IMAGES_ALERT);
        }, 600);
    }
}