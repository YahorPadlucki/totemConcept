import {Button} from "../generic/Button";
import {LoaderCache} from "../../loader/cache/LoaderCache";
import {get} from "../../utils/locator/locator";
import Sprite = PIXI.Sprite;
import Texture = PIXI.Texture;
import Point = PIXI.Point;

export class StopButton extends Button {

    private loaderCache: LoaderCache = get(LoaderCache);
    private stopButtonBackImage: Sprite;

    constructor() {
        super();
        const buttonTexture = this.loaderCache.getTexture("spinButtonBack");
        this.stopButtonBackImage = new Sprite(buttonTexture);

        const playIconTexture:Texture = this.loaderCache.getTexture("stopBtnIcon");
        const stopIcon:Sprite = new Sprite(playIconTexture);

        this.stopButtonBackImage.tint = 0xec1313;

        this.stopButtonBackImage.pivot = new Point(this.stopButtonBackImage.width / 2, this.stopButtonBackImage.height / 2);
        this.addChild(this.stopButtonBackImage);

        stopIcon.pivot = new Point(stopIcon.width / 2, stopIcon.height / 2);
        this.addChild(stopIcon);
    }
}