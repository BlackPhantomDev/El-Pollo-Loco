class World {
    character = new Character();
    bottles = []
    level = level1;
    canvas;
    ctx;
    keyboard;
    cameraX = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.setWorld();
        this.draw();
        this.run();
    }
    
    setWorld() {
        this.character.world = this;
        this.level.chickens.forEach(c => c.world = this);
        this.level.endboss.forEach(e => e.world = this);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.cameraX, 0);
        
        this.addObjectsToMap(this.level.backgroundObjects);
        
        this.addObjectsToMap(this.level.chickens);
        this.addObjectsToMap(this.level.endboss);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        this.addObjectsToMap(this.bottles)
        
        this.ctx.translate(-this.cameraX, 0);
        this.addObjectsToMap(this.level.statusBars);
        this.ctx.translate(this.cameraX, 0);
        
        this.ctx.translate(-this.cameraX, 0);
        
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }
    
    stopGame() {
        console.log('game stopped');
        
    }

    run() {
        setInterval(() => {
            this.collisionCharacterWithEnemy();
            this.collisionBottleWithEnemy();
            this.collisionCharacterWithCoin();
        }, 1000 / 60);
    }

    collisionCharacterWithEnemy() {
        this.level.chickens.forEach((chicken) => {
            if (this.character.isColiding(chicken)) {
                this.character.getHurted(0, 20);
            }
        });
        this.level.endboss.forEach((endboss) => {
            if (this.character.isColiding(endboss)) {
                this.character.getHurted(0, 20);
            }
    });
    }

    collisionBottleWithEnemy() {
        this.bottleWithChicken();
        this.bottleWithEndboss();
    }

    bottleWithChicken() {
        this.level.chickens.forEach((chicken) => {
            this.bottles.forEach((bottle) => {
                if (bottle.isColiding(chicken)) {
                    bottle.bottleHits();
                    chicken.health = 0;
                    setTimeout(() => {
                        this.level.chickens = this.level.chickens.filter(c => c !== chicken);
                    }, 3000);
                }
            });
        });
    }
    
    bottleWithEndboss() {
        this.level.endboss.forEach((endboss) => {
            this.bottles.forEach((bottle) => {
                if (bottle.isColiding(endboss)) {
                    bottle.bottleHits();
                    endboss.getHurted(3, 10, 'endboss');
                    if (endboss.health <= 0) {
                        setTimeout(() => {
                            this.level.endboss = this.level.endboss.filter(e => e !== endboss);
                        }, 700);
                    }
                }
            });
        });
    }

    collisionCharacterWithCoin() {

    }

    checkBottles() {
        if (this.keyboard.KEY_K && this.character.bottleAmount != 0) {
            let bottle = new Bottle(this.character.positionX + 100, this.character.positionY)
            this.bottles.push(bottle);
            this.character.bottleAmount -= 1;
        }
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o)
        });
    }

    addToMap(mo) {
        this.flipCharacter(mo);
        mo.draw(this.ctx);
        this.undoFlipCharacter(mo);
    }

    flipCharacter(mo) {
        if (mo.isCharacterFlipped) {
            this.ctx.save();
            this.ctx.translate(mo.width, 0);
            this.ctx.scale(-1, 1);
            mo.positionX = mo.positionX * -1;
        }
    }

    undoFlipCharacter(mo) {
        if (mo.isCharacterFlipped) {
            mo.positionX = mo.positionX * -1;
            this.ctx.restore();
        }
    }

}