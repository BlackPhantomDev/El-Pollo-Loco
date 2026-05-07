class DrawableObject {
    img;

    positionY;
    positionX;

    width;
    height;

    imageCache = {};
    currentImage = 0;

    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }
    
    loadImages(arr) {
        arr.forEach((path) => {
            let img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.positionX, this.positionY, this.width, this.height);
    }

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