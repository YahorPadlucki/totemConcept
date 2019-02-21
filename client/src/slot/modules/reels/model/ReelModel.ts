export class ReelModel {

    private _reelIndex: number;
    private _currentState: ReelState;

    public symbolsTape: number[];

    set reelIndex(value: number) {
        this._reelIndex = value;
    }

    get reelIndex() {
        return this._reelIndex;
    }

    set currentState(value: ReelState) {
        this._currentState = value;
    }

    get currentState() {
        return this._currentState;
    }

    updateTape(tape: number[]) {
        this.symbolsTape = tape.concat();
    }

}

export const enum ReelState {
    Idle,
    StartSpin,
    Spin,
    StartStop,
    ManualStop,
    Stopping
}