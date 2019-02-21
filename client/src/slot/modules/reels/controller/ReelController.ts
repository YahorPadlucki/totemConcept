import {ReelView} from "../view/ReelView";
import {
    ReelModel,
    ReelState
} from "../model/ReelModel";
import {EventDispatcher} from "../../utils/dispatcher/EventDispatcher";
import {SlotEvent} from "../../../SlotEvent";
import {SlotModel} from "../../../SlotModel";
import {get} from "../../utils/locator/locator";

export class ReelController {
    public reelView: ReelView;
    public model: ReelModel;

    private autoStopTime: number = 500;
    private autoStopTimer: any;

    private slotModel: SlotModel = get(SlotModel);

    private dispatcher: EventDispatcher = get(EventDispatcher);

    constructor(reelView: ReelView, model: ReelModel) {
        this.reelView = reelView;
        this.model = model;

        this.model.currentState = ReelState.Idle;

        this.dispatcher.addListener(SlotEvent.NEW_REELS_TAPES_RECEIVED, () => this.model.updateTape(this.slotModel.tapes[this.model.reelIndex]), this);
    }

    public onSpinClicked(): void {

        clearTimeout(this.autoStopTimer);

        switch (this.model.currentState) {
            case ReelState.Idle:
                this.model.currentState = ReelState.StartSpin;
                this.dispatcher.dispatch(SlotEvent.REELS_SPIN_STARTED);
                break;
        }
    }

    public stopOnServerResponse(): void {
        if (!this.isReelSpinning) { return; }

        clearTimeout(this.autoStopTimer);
        const stopTime = this.autoStopTime + (this.model.reelIndex * 500);
        this.autoStopTimer = setTimeout(() => this.onStopClicked(true), stopTime);
    }

    public onStopClicked(auto: boolean = false): void {
        if (!this.isReelSpinning) { return; }
        clearTimeout(this.autoStopTimer);

        this.stopReel(auto);
    }

    private stopReel(isAutoStop: boolean = false) {

        if (isAutoStop) {
            this.model.currentState = ReelState.StartStop;

        } else {
            this.model.currentState = ReelState.ManualStop;

        }
    }

    private get isReelSpinning(): boolean {
        return this.model.currentState !== ReelState.Idle && this.model.currentState !== ReelState.Stopping;
    }

}