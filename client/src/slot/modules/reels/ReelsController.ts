import Container = PIXI.Container;
import Graphics = PIXI.Graphics;
import {ReelView} from "./view/ReelView";
import {EventDispatcher} from "../utils/dispatcher/EventDispatcher";
import {
    ReelModel,
    ReelState
} from "./model/ReelModel";
import {ReelController} from "./controller/ReelController";
import {SlotEvent} from "../../SlotEvent";
import {SlotModel} from "../../SlotModel";
import {get} from "../utils/locator/locator";
import {SlotConfig} from "../../SlotConfig";

export class ReelsController extends Container {

    private reelsCount: number;
    private reelsGap: number;

    private reels: ReelView[] = [];
    private reelsControllers: ReelController[] = [];

    private reelsMask: Graphics;

    private slotModel: SlotModel = get(SlotModel);
    private slotConfig: SlotConfig = get(SlotConfig);

    private reelsStopped: boolean = true;
    public visibleHeight: number = 315;
    private dispatcher: EventDispatcher = get(EventDispatcher);

    constructor() {
        super();

        this.reelsCount = this.slotConfig.reels.reelsCount;
        this.reelsGap = this.slotConfig.reels.gapBetweenReels;

        for (let i = 0; i < this.reelsCount; i++) {

            const reelModel = new ReelModel();
            reelModel.updateTape(this.slotModel.tapes[i]);
            reelModel.reelIndex = i;

            const reel = new ReelView(reelModel);
            reel.x = reel.width * i + this.reelsGap * i;

            this.reels.push(reel);
            this.reelsControllers.push(new ReelController(reel, reelModel));

            this.addChild(reel);
        }
        this.reelsMask = new Graphics();
        this.reelsMask.beginFill(0x000000, 0.5);
        this.reelsMask.drawRect(0, 0, 560, this.visibleHeight);
        this.reelsMask.endFill();
        this.addChild(this.reelsMask);

        this.mask = this.reelsMask;

        this.dispatcher.addListener(SlotEvent.ENTER_FRAME, this.onEnterFrame, this);

        this.dispatcher.addListener(SlotEvent.SERVER_SPIN_RESPONSE_RECEIVED, this.onServerResponse, this);
        this.dispatcher.addListener(SlotEvent.STOP_CLICK, this.onStopClicked, this);
        this.dispatcher.addListener(SlotEvent.SPIN_CLICK, this.onSpinClicked, this);
        this.dispatcher.addListener(SlotEvent.HIDE_REELS, this.onHideReels, this);
        this.dispatcher.addListener(SlotEvent.SHOW_REELS, this.onShowReels, this);
        this.dispatcher.addListener(SlotEvent.UPDATE_REEL_SYMBOLS, this.updateReelSymbols, this);

    }

    private updateReelSymbols(newReelSymbols: number[][]): void {
        this.reels.forEach((reel, reelIndex) => {
            let reelSymbols: number[] = [];
            newReelSymbols.forEach((line) => {
                reelSymbols.push(line[reelIndex]);
            });
            reel.changeSymbols(reelSymbols);
        });

    }

    private onHideReels(): void {
        this.visible = false;
    }

    private onShowReels(): void {
        this.visible = true;
    }

    private onSpinClicked(): void {
        this.reelsStopped = false;
        this.reelsControllers.forEach(reelsController => reelsController.onSpinClicked());
    }

    private onStopClicked(): void {
        this.reelsControllers.forEach(reelController => reelController.onStopClicked());
    }

    private onServerResponse(): void {
        this.reelsControllers.forEach(reelController => reelController.stopOnServerResponse());
    }

    private onEnterFrame(deltaTime: number): void {
        let allReelsIdle: boolean = true;
        //TODO:refactor
        this.reelsControllers.forEach(reelController => {
            if (reelController.model.currentState !== ReelState.Idle) {
                this.reelsStopped = false;
                allReelsIdle = false;
            }
        });

        if (allReelsIdle && !this.reelsStopped) {
            this.reelsStopped = true;
            this.dispatcher.dispatch(SlotEvent.REELS_STOPPED);
        }

        this.reels.forEach(reel => reel.draw(deltaTime));
    }
}