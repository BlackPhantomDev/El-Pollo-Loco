class World {
    character = new Character();
    bottles = []
    level = level1;
    canvas;
    ctx;
    keyboard;
    cameraX = 0;

    myAnimationFrame;

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
        this.setObjects();
        
        this.ctx.translate(-this.cameraX, 0);
        this.addObjectsToMap(this.level.statusBars);
        
        let self = this;
        this.myAnimationFrame = requestAnimationFrame(function() {
            self.draw();
        });
    }

    setObjects() {
        this.addObjectsToMap(this.level.chickens);
        this.addObjectsToMap(this.level.endboss);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.bottles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
    }
    
    stopGame() {
        setTimeout(() => {
            if (this.character.health > 0) initGameEnding(true);
            else initGameEnding(false);
            cancelAnimationFrame(this.myAnimationFrame);
        }, 300);
    }

    run() {
        setInterval(() => {
            this.collisionCharacterWithEnemy();
            this.collisionBottleWithEnemy();
            this.characterCollectsBottle();
            this.characterCollectsCoin();
        }, 1000 / 60);
    }

    collisionCharacterWithEnemy() {
        this.level.chickens.forEach((chicken) => {
            if (this.character.isColliding(chicken)) {
                this.character.getHurted(0, 20);
            }
        });
        this.level.endboss.forEach((endboss) => {
            if (this.character.isColliding(endboss)) {
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
                if (bottle.isColliding(chicken)) {
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
                if (bottle.isColliding(endboss)) {
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

    characterCollectsBottle() {
        this.level.bottles.forEach((bottle) => {
            if (bottle.isColliding(this.character)) {
                this.character.bottleAmount += 1;
                this.level.bottles = this.level.bottles.filter(b => b !== bottle)
            }
        });
    }

    characterCollectsCoin() {
        this.level.coins.forEach((coin) => {
            if (coin.isColliding(this.character)) {
                coin.coinCollected();
                setTimeout(() => {
                    this.character.coinsCollected += 1;
                    this.level.coins = this.level.coins.filter(c => c !== coin)
                }, 60);
            }
        });
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