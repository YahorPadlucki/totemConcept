import {SlotEvent} from "../../SlotEvent";
import {get} from "../utils/locator/locator";
import {EventDispatcher} from "../utils/dispatcher/EventDispatcher";
import {SlotModel} from "../../SlotModel";
import {SlotConfig} from "../../SlotConfig";
import {TotemLineView} from "./TotemLineView";
import {SymbolView} from "../symbols/SymbolView";
import Container = PIXI.Container;

export class TotemLineContainer extends Container {
    private dispatcher: EventDispatcher = get(EventDispatcher);
    private slotModel: SlotModel = get(SlotModel);
    private slotConfig: SlotConfig = get(SlotConfig);
    private totemLines: TotemLineView[] = [];
    private readonly totemSymbolID: number = 4;


    constructor() {
        super();
        this.dispatcher.addListener(SlotEvent.REELS_STOPPED, this.onReelsStopped, this);
        this.dispatcher.addListener(SlotEvent.REELS_SPIN_STARTED, this.onReelsStarted, this);
    }

    private onReelsStarted(): void {
        this.dispatcher.dispatch(SlotEvent.SHOW_REELS);

        while (this.children.length) {
            this.removeChildAt(0);
        }

    }

    private onReelsStopped(): void {

        this.dispatcher.dispatch(SlotEvent.HIDE_REELS);
        this.buildLInes();
        this.findTotems();

    }

    private buildLInes(): void {
        for (let i = 0; i < this.slotConfig.reels.rowsCount; i++) {
            const totemLineView: TotemLineView = new TotemLineView();

            for (let j = 0; j < this.slotConfig.reels.reelsCount; j++) {
                const stopPosition: number = this.slotModel.getStopReelsPosition()[j];

                const symbolId: number = this.slotModel.tapes[j][stopPosition + i];
                const symbolView: SymbolView = new SymbolView(symbolId);
                symbolView.x = symbolView.width * j + this.slotConfig.reels.gapBetweenReels * j;

                totemLineView.addChild(symbolView);
            }
            totemLineView.y = totemLineView.height * i + this.slotConfig.reels.gapBetweenRows * i;
            this.addChild(totemLineView);
        }
    }

    private findTotems(): void {
        let reelWithTotemPart: number;
        for (let i = 0; i < this.slotConfig.reels.rowsCount - 1; i++) {
            const totemIndexOnCurrentReel:number = this.getTotemLineIndexOnReel(i);
            if ( totemIndexOnCurrentReel!== -1) {
                const totemIndexOnNexReel:number = this.getTotemLineIndexOnReel(i + 1);
            }
        }
    }

    private getTotemLineIndexOnReel(reelIndex: number): number {
        const stopPosition: number = this.slotModel.getStopReelsPosition()[reelIndex];
        const reelSymbols: number[] = this.slotModel.tapes[stopPosition];
        const totemSymbolLineIndex: number = reelSymbols.indexOf(this.totemSymbolID);

        return totemSymbolLineIndex;

    }


}