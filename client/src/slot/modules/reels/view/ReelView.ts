import Container = PIXI.Container;
import {SymbolView} from "../../symbols/SymbolView";
import {
    ReelModel,
    ReelState
} from "../model/ReelModel";
import {get} from "../../utils/locator/locator";
import {SlotModel} from "../../../SlotModel";
import {SlotConfig} from "../../../SlotConfig";
import {EventDispatcher} from "../../utils/dispatcher/EventDispatcher";

export class ReelView extends Container {

    private verticalGap: number;
    private rows: number;

    private symbolsInTape: SymbolView[] = [];

    private tapeHeight: number;

    private spinSpeed: number = 0;
    private maxSpinSpeed: number;

    private previousState: ReelState = ReelState.Idle;
    private _currentTapeIndex: number = 0;

    private inited: boolean;

    private readyToStop: boolean;
    private stopPositionsPrepared: boolean;

    private slotModel: SlotModel = get(SlotModel);
    private slotConfig: SlotConfig = get(SlotConfig);
    private dispatcher: EventDispatcher = get(EventDispatcher);

    private reelModel: ReelModel;

    constructor(reelModel: ReelModel) {
        super();
        this.reelModel = reelModel;
        this.maxSpinSpeed = this.slotConfig.reels.maxSpinSpeed;
        this.rows = this.slotConfig.reels.rowsCount;
        this.verticalGap = this.slotConfig.reels.gapBetweenRows;

        this.init();

    }

    public init() {
        this.prepareTape();
        this.tapeHeight = this.symbolsInTape[0].y + (this.verticalGap * this.symbolsInTape.length - 1) + (this.symbolsInTape[0].height * this.symbolsInTape.length);
        this.inited = true;
    }

    private prepareTape() {

        this.currentTapeIndex = this.getNormalizedPosition(3 + this.slotModel.getStopReelsPosition()[this.reelModel.reelIndex]);
        for (let i = this.rows - 1; i >= 0; i--) {

            const symbolIndex = this.reelModel.symbolsTape[this.currentTapeIndex];
            const symbol = new SymbolView(symbolIndex);

            symbol.y = symbol.symbolHeight * i + this.verticalGap * i;
            this.symbolsInTape[i] = symbol;
            this.addChild(symbol);
            this.currentTapeIndex--;
        }
    }

    public changeSymbols(symbols: number[]): void {
        for (let i = this.rows - 1; i >= 0; i--) {

            const symbolIndex = symbols[i];

            this.symbolsInTape[i].setSymbolImage(symbolIndex);

        }
    }


    draw(deltaTime: number) {
        if (!this.inited) {
            return;
        }
        const currentState = this.reelModel.currentState;
        if (this.previousState !== currentState) {
            switch (this.reelModel.currentState) {
                case ReelState.Idle:
                    break;
                case ReelState.StartSpin:
                    this.startSpin();
                    break;
                case ReelState.StartStop:
                    break;
                case ReelState.ManualStop:
                    break;
            }

            this.previousState = currentState;
        }

        this.checkIfReadyToStop();
        this.spin(deltaTime);
    }

    private startSpin(): void {
        this.stopPositionsPrepared = false;
        this.readyToStop = false;
        this.symbolsInTape.forEach((symbol) => symbol.setSymbolStopPositionIndexes(-1, -1));
        TweenLite.killTweensOf(this);
        TweenLite.to(
            this,
            0.5,
            {
                spinSpeed: this.maxSpinSpeed,
                onComplete: () => {
                    if (this.reelModel.currentState === ReelState.StartSpin) {
                        this.reelModel.currentState = ReelState.Spin;
                    }
                }
            }
        );
    }

    private spin(deltaTime: number): void {
        this.symbolsInTape.forEach((symbol) => symbol.y += this.spinSpeed);
        if (this.reelModel.currentState !== ReelState.Stopping) {
            this.updateSymbols();
        }

    }

    private updateSymbols() {

        const topSymbol = this.symbolsInTape[0];
        const bottomSymbol = this.symbolsInTape[this.symbolsInTape.length - 1];

        if (topSymbol.y >= -topSymbol.symbolHeight + this.verticalGap) {

            if (this.reelModel.currentState === ReelState.StartStop) {

                const stopPosition = this.getNormalizedPosition(this.slotModel.getStopReelsPosition()[this.reelModel.reelIndex] - 1);
                const finalBottomRowPosition = this.getNormalizedPosition(stopPosition + this.rows);

                if (!this.stopPositionsPrepared) {

                    if (this.currentTapeIndex !== finalBottomRowPosition) {
                        this.currentTapeIndex = finalBottomRowPosition;
                    }
                    this.stopPositionsPrepared = true;

                } else {
                    if (!this.readyToStop) {

                        if (this.currentTapeIndex === stopPosition) {
                            this.readyToStop = true;
                        }

                    }
                }

            } else {
                if (this.reelModel.currentState === ReelState.ManualStop) {
                    this.readyToStop = true;
                }

            }

            this.addSymbolToTop();
        }
        if (bottomSymbol.y >= this.tapeHeight) {
            bottomSymbol.onDestroy();
            this.removeChild(bottomSymbol);
            this.symbolsInTape.pop();
        }
    }

    private changeSymbolsToStopSymbols() {
        const finalPosition = this.slotModel.getStopReelsPosition()[this.reelModel.reelIndex];

        for (let i = this.rows - 1; i >= 0; i--) {
            let symbolTapePosition = finalPosition + i;
            const tapeLength = this.reelModel.symbolsTape.length;
            if (symbolTapePosition >= tapeLength) {
                symbolTapePosition -= tapeLength;
            }
            const symbolFromTape = this.reelModel.symbolsTape[symbolTapePosition];
            this.symbolsInTape[i + 1].setSymbolImage(symbolFromTape);

        }
    }

    private getNormalizedPosition(position: number): number {
        const tapeLength = this.reelModel.symbolsTape.length;

        if (position >= tapeLength) {
            position -= tapeLength;
        }
        if (position < 0) {
            position += tapeLength;
        }

        return position;
    }

    private checkIfReadyToStop() {
        if (!this.readyToStop) {
            return;
        }
        const topVisibleSymbol = this.symbolsInTape[1];
        if (topVisibleSymbol.y >= -topVisibleSymbol.height / 2 && topVisibleSymbol.y <= 0) {
            if (this.reelModel.currentState === ReelState.ManualStop) {
                this.changeSymbolsToStopSymbols();
            }
            this.stopSpin();

        }
    }

    private stopSpin() {
        TweenLite.killTweensOf(this);

        this.spinSpeed = 0;
        this.readyToStop = false;
        this.reelModel.currentState = ReelState.Stopping;

        const topVisibleSymbol = this.symbolsInTape[1];
        const finalYShift = topVisibleSymbol.y * -1;

        this.symbolsInTape.forEach((symbol, index) => {
            const easOutY = symbol.y + finalYShift + 20;
            const easeInY = symbol.y + finalYShift;
            symbol.setSymbolStopPositionIndexes(index - 1, this.reelModel.reelIndex);
            TweenLite.killTweensOf(symbol);
            TweenLite.to(
                symbol,
                0.1,
                {
                    ease: Sine.easeOut,
                    y: easOutY,
                    onComplete: () => {
                        TweenLite.to(
                            symbol,
                            0.2,
                            {
                                ease: Sine.easeIn,
                                y: easeInY,
                                onComplete: () => {
                                    this.reelModel.currentState = ReelState.Idle;
                                }
                            });
                    }
                });
        });

    }

    private addSymbolToTop() {
        const symbolFromTape = this.reelModel.symbolsTape[this.currentTapeIndex];
        const topNonVisibleSymbol = new SymbolView(symbolFromTape);
        const topVisibleSymbolPosition = this.symbolsInTape[0].y;

        topNonVisibleSymbol.y = topVisibleSymbolPosition - this.verticalGap - topNonVisibleSymbol.symbolHeight;
        this.addChild(topNonVisibleSymbol);
        this.symbolsInTape.unshift(topNonVisibleSymbol);

        this.currentTapeIndex--;
    }

    private get currentTapeIndex() {
        if (this._currentTapeIndex < 0) {
            this._currentTapeIndex += this.reelModel.symbolsTape.length;
        }

        return this._currentTapeIndex;
    }

    private set currentTapeIndex(value: number) {
        this._currentTapeIndex = value;
    }
}