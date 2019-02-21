import {BaseScene} from "../BaseScene";
import {LoadingBar} from "./LoadingBar";
import Point = PIXI.Point;
import {EventDispatcher} from "../../utils/dispatcher/EventDispatcher";
import {get} from "../../utils/locator/locator";
import {LoadingManagerEvent} from "../../loader/events/LoaderEvent";

export class LoadingScene extends BaseScene {

    private progressBar: LoadingBar;
    private dispatcher: EventDispatcher = get(EventDispatcher);

    constructor(minWidth, minHeight) {
        super(minWidth, minHeight);
        const sceneBack = this.getSceneBackGraphics();
        this.addChild(sceneBack);

        this.progressBar = new LoadingBar();
        this.progressBar.pivot = new Point(0.5, 0.5);
        this.addChild(this.progressBar);

        this.dispatcher.addListener(LoadingManagerEvent.MAIN_ASSETS_LOAD_PROGRESS, (percent: number) => {
                this.progressBar.showProgress(percent);
            }
        );
    }

    private getSceneBackGraphics(): PIXI.Graphics {

        const graphics = new PIXI.Graphics();
        graphics.beginFill(0xccFFcc);
        graphics.drawRect(-this.minWidth / 2, -this.minHeight / 2, this.minWidth, this.minHeight);
        graphics.endFill();

        return graphics;
    }
}