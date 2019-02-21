import {ReelsController} from "../reels/ReelsController";
import {UiPanel} from "../ui/UiPannel";
import {BaseScene} from "./BaseScene";
import TextureCache = PIXI.utils.TextureCache;
import Sprite = PIXI.Sprite;
import Point = PIXI.Point;
import {LoaderCache} from "../loader/cache/LoaderCache";
import {get} from "../utils/locator/locator";

export class ReelsScene extends BaseScene {

    private sceneBack: PIXI.Graphics;

    private reelsContainer: ReelsController;
    private uiPannel: UiPanel;

    private loaderCache: LoaderCache = get(LoaderCache);

    constructor(minWidth, minHeight) {
        super(minWidth, minHeight);
        this.sceneBack = this.getSceneBackGraphics();

        this.reelsContainer = new ReelsController();
        this.reelsContainer.x = -this.reelsContainer.width / 2;

        this.addChild(this.sceneBack);

        this.addChild(this.reelsContainer);

        this.uiPannel = new UiPanel();
        this.addChild(this.uiPannel);

        this.reelsContainer.y = -this.reelsContainer.visibleHeight / 2 - this.uiPannel.height / 2;
    }

    private getSceneBackGraphics(): PIXI.Graphics {

        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xcccccc);
        graphics.drawRect(-this.minWidth / 2, -this.minHeight / 2, this.minWidth, this.minHeight);
        graphics.endFill();

        return graphics;
    }

    public onResize(): void {
        this.uiPannel.x = -this.minWidth / 2;
        this.uiPannel.y = this.minHeight / 2 - this.uiPannel.height;
        this.uiPannel.onResize();

    }
}