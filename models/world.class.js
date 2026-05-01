class World {
    character = new Character();
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
        this.checkCollisions();
    }
    
    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.translate(this.cameraX, 0);

        this.addObjectsToMap(this.level.backgroundObjects);

        this.ctx.translate(-this.cameraX, 0);
        this.addObjectsToMap(this.level.statusBars);
        this.ctx.translate(this.cameraX, 0);

        this.addObjectsToMap(this.level.chickens);
        this.addObjectsToMap(this.level.endboss);
        this.addObjectsToMap(this.level.clouds);
        this.addToMap(this.character);
        
        this.ctx.translate(-this.cameraX, 0);

        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });

    }

    checkCollisions() {
        setInterval(() => {
            this.collisionCharacterWithEnemy();
            this.collisionEnemyWithBottle();
            this.collisionCharacterWithCoin();
        }, 600);
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

    collisionEnemyWithBottle() {

    }

    collisionCharacterWithCoin() {

    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o)
        });
    }

    addToMap(mo) {
        this.flipCharacter(mo);
        mo.draw(this.ctx);
        if (mo.drawColFrame) mo.drawColFrame(this.ctx);
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