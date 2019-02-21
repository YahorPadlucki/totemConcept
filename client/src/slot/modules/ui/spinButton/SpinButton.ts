import {Button} from "../generic/Button";
import {LoaderCache} from "../../loader/cache/LoaderCache";
import {get} from "../../utils/locator/locator";
import {EventDispatcher} from "../../utils/dispatcher/EventDispatcher";
import Sprite = PIXI.Sprite;
import Point = PIXI.Point;
import Texture = PIXI.Texture;

export class SpinButton extends Button {

    private loaderCache: LoaderCache = get(LoaderCache);
    private spinButtonBackImage: Sprite;
    private dispatcher: EventDispatcher = get(EventDispatcher);

    constructor() {
        super();
        const spinButtonTexture = this.loaderCache.getTexture("spinButtonBack");
        this.spinButtonBackImage = new Sprite(spinButtonTexture);

        const playIconTexture: Texture = this.loaderCache.getTexture("playBtnIcon");
        const playIcon: Sprite = new Sprite(playIconTexture);

        this.spinButtonBackImage.pivot = new Point(this.spinButtonBackImage.width / 2, this.spinButtonBackImage.height / 2);

        this.addChild(this.spinButtonBackImage);

        playIcon.pivot = new Point(playIcon.width / 2.3, playIcon.height / 2);
        this.addChild(playIcon);

    }

    public disable(): void {
        super.disable();
        this.spinButtonBackImage.tint = 0xC0C0C0;
    }

    public enable(): void {
        super.enable();
        this.spinButtonBackImage.tint = 0x228B22;
    }

}