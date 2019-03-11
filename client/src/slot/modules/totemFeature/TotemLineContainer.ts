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

    private finalSymbolsView: number[][] = [];


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

        this.moveLines(this.getLineIndexToMove());

    }

    public moveLines(lineIndexesToMove: number[]): void {

        const startReelIndex: number = lineIndexesToMove.splice(0, 1)[0];


        lineIndexesToMove.forEach((lineIndex, index) => {
            const tilesToMove: number = startReelIndex + ((lineIndexesToMove.length - 1) - index);
            const tileWidth: number = this.slotConfig.reels.symbolWidth + this.slotConfig.reels.gapBetweenReels;

            for (let i = 0; i < tilesToMove; i++) {
                this.finalSymbolsView[lineIndex].splice(startReelIndex + i, 0, null);
                this.finalSymbolsView[lineIndex].pop();
            }
            TweenLite.to(
                this.totemLines[lineIndex],
                0.5,
                {
                    ease: Sine.easeOut,
                    x: tilesToMove * tileWidth,
                    onComplete: () => {

                    }
                });
        });

        this.finalSymbolsView.forEach((line, index) =>
            this.finalSymbolsView[index] = this.finalSymbolsView[index].splice(-this.slotConfig.reels.reelsCount)
        );
        this.dispatcher.dispatch(SlotEvent.UPDATE_REEL_SYMBOLS, this.finalSymbolsView);
        // console.log(this.finalSymbolsView);


    }

    private prepareLines(): void {

        const graphics = new PIXI.Graphics();

        const reelsCount: number = this.slotConfig.reels.reelsCount;
        const gap: number = this.slotConfig.reels.gapBetweenReels;
        const maskWidth = reelsCount * this.slotConfig.reels.symbolWidth + (reelsCount - 1) * gap;

        graphics.beginFill(0xFF3300);

        graphics.moveTo(0, -50);
        graphics.lineTo(maskWidth, 0);
        graphics.lineTo(maskWidth, 500);
        graphics.lineTo(0, 500);
        graphics.lineTo(0, 0);
        graphics.endFill();
        this.addChild(graphics);
        this.mask = graphics;

        this.totemLines = [];
        for (let i = 0; i < this.slotConfig.reels.rowsCount; i++) {
            const totemLineView: TotemLineView = new TotemLineView();
            this.finalSymbolsView[i] = [];
            for (let j = -3; j < this.slotConfig.reels.reelsCount; j++) {
                const additionalSymbols: number[] = [1, 2, 3];
                const randomSymbolIndex = Math.floor(Math.random() * additionalSymbols.length);

                const stopPosition: number = this.slotModel.getStopReelsPosition()[j];


                let symbolId: number;
                if (j < 0) {
                    symbolId = additionalSymbols[randomSymbolIndex];
                }
                else {
                    symbolId = this.slotModel.tapes[j][stopPosition + i];

                }
                const symbolView: SymbolView = new SymbolView(symbolId);

                this.finalSymbolsView[i].push(symbolId);
                symbolView.x = symbolView.width * j + this.slotConfig.reels.gapBetweenReels * j;

                totemLineView.addChild(symbolView);
            }
            totemLineView.y = totemLineView.height * i + this.slotConfig.reels.gapBetweenRows * i;
            this.addChild(totemLineView);
            this.totemLines.push(totemLineView);
        }

        console.log(this.finalSymbolsView);
    }

    private getLineIndexToMove(): number[] {
        let longestSequence: number[] = [];
        let startReel: number;
        for (let i = 0; i < this.slotConfig.reels.reelsCount - 1; i++) {
            let totemIndexes: number[] = [];
            const totemIndexOnCurrentReels = this.getTotemLineIndexOnReel(i);
            if (totemIndexOnCurrentReels !== -1) {
                totemIndexes.push(totemIndexOnCurrentReels);
                totemIndexes = this.getTotemIndexesSequence(i, totemIndexes.concat());
                if (totemIndexes.length >= longestSequence.length) {
                    longestSequence = totemIndexes.concat();
                    startReel = i;

                }
            }
        }
        longestSequence.unshift(startReel);
        return longestSequence;
    }

    private getTotemIndexesSequence(reelIndex: number, totemIndexes: number[]): number[] {
        const nextReelIndex: number = reelIndex + 1;

        totemIndexes.forEach((lineIndex) => {
            if (nextReelIndex < this.slotConfig.reels.reelsCount - 1) {
                const totemIndexOnNexReel: number = this.getTotemLineIndexOnReel(nextReelIndex);
                if (totemIndexOnNexReel !== -1 && Math.abs(lineIndex - totemIndexOnNexReel) === 1) {
                    totemIndexes.push(totemIndexOnNexReel);
                }
                this.getTotemIndexesSequence(nextReelIndex, totemIndexes);
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