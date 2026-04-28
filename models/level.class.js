class Level {

    chickens;
    endboss;
    clouds;
    backgroundObjects;
    levelEndX = 5400;

    constructor(ch, eb, cl, bo) {
        this.chickens = ch;
        this.endboss = eb;
        this.clouds = cl;
        this.backgroundObjects = bo;
    }
}