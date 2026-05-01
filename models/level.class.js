class Level {

    chickens;
    endboss;
    clouds;
    backgroundObjects;
    statusBars;
    levelEndX = 5400;

    constructor(ch, eb, cl, bo, sb) {
        this.chickens = ch;
        this.endboss = eb;
        this.clouds = cl;
        this.backgroundObjects = bo;
        this.statusBars = sb;
    }
}