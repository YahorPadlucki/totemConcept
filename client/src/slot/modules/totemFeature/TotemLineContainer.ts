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
        this.prepareLines();
        this.getLineIndexToMove()
        // this.moveLines();

    }

    public moveLines(lineIndexesToMove: number[][]): void {
        TweenLite.to(
            this.totemLines[0],
            0.5,
            {
                ease: Sine.easeOut,
                x: this.slotConfig.reels.symbolWidth + this.slotConfig.reels.gapBetweenReels,
                onComplete: () => {

                }
            });
    }

    private prepareLines(): void {
        this.totemLines = [];
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
            this.totemLines.push(totemLineView);
        }
    }

    private getLineIndexToMove(): number[][] {
        let lineIndexToMove: number[][] = [];
        let longestSequence; //
        for (let i = 0; i < this.slotConfig.reels.reelsCount - 1; i++) {
            let totemIndexes: number[] = [];
            const totemIndexOnCurrentReels = this.getTotemLineIndexOnReel(i);
            if (totemIndexOnCurrentReels !== -1) {
                totemIndexes.push(totemIndexOnCurrentReels);
                totemIndexes = this.getTotemIndexesSequence(i, totemIndexes.concat());
                console.log("===== reel " + i + " ", totemIndexes)
            }
        }
        return lineIndexToMove;
    }

    private getTotemIndexesSequence(reelIndex: number, totemIndexes: number[]): number[] {
        const nextReelIndex: number = reelIndex + 1;

        totemIndexes.forEach((lineIndex) => {
            if (nextReelIndex < this.slotConfig.reels.reelsCount-1) {
                const totemIndexOnNexReel: number = this.getTotemLineIndexOnReel(nextReelIndex);
                if (totemIndexOnNexReel !== -1 && Math.abs(lineIndex - totemIndexOnNexReel) === 1) {
                    totemIndexes.push(totemIndexOnNexReel);
                    this.getTotemIndexesSequence(nextReelIndex, totemIndexes);
                }
            }

        });

        return totemIndexes;

    }


    private getTotemLineIndexOnReel(reelIndex: number): number {
        const stopPosition: number = this.slotModel.getStopReelsPosition()[reelIndex];
        const reelSymbols: number[] = this.slotModel.tapes[reelIndex];
        const stoppedSymbols: number[] = reelSymbols.slice(stopPosition, this.slotConfig.reels.rowsCount + 1);
        const totemSymbolLineIndex: number = stoppedSymbols.indexOf(this.totemSymbolID);

        return totemSymbolLineIndex;

    }


}