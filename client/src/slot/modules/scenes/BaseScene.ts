import Container = PIXI.Container;

export class BaseScene extends Container {
    protected minWidth: number;
    protected minHeight: number;

    constructor(minWidth, minHeight) {
        super();
        this.minWidth = minWidth;
        this.minHeight = minHeight;
    }

    public onResize():void {

    }

}