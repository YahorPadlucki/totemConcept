import {SlotEvent} from "../../SlotEvent";
import {get} from "../utils/locator/locator";
import {EventDispatcher} from "../utils/dispatcher/EventDispatcher";
import {SlotModel} from "../../SlotModel";
import {SlotConfig} from "../../SlotConfig";
import {TotemLineView} from "./TotemLineView";
import {SymbolView} from "../symbols/SymbolView";

export class TotemLineController {
    private dispatcher: EventDispatcher = get(EventDispatcher);
    private slotModel: SlotModel = get(SlotModel);
    private slotConfig: SlotConfig = get(SlotConfig);
    private view: TotemLineView;


    constructor(view: TotemLineView) {
        this.view = view;
        this.dispatcher.addListener(SlotEvent.REELS_STOPPED, this.onReelsStopped, this);
    }

    public onReelsStopped(): void {

        for (let i = 0; i < this.slotConfig.reels.reelsCount; i++) {
            const finalPosition = this.slotModel.getStopReelsPosition()[i];

        }

        this.view.addChild(new SymbolView(1));


    }
}