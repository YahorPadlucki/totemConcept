import {EventDispatcher} from "./modules/utils/dispatcher/EventDispatcher";
import {SlotEvent} from "./SlotEvent";
import {ISpinResponse} from "./modules/server/interfaces/ISpinResponse";
import {IInitResponse} from "./modules/server/interfaces/IInitResponse";
import {IServerReelsResponse} from "./modules/server/interfaces/ServerResponseInterfaces";
import {RewardsModel} from "./modules/rewards/RewardsModel";
import {get} from "./modules/utils/locator/locator";

export class SlotModel {
    private _currentSlotState;
    private _stopReelsPosition: number[];
    private _tapes: number[][];
    private _lines: number[][];

    private rewardsModel: RewardsModel = get(RewardsModel);
    private dispatcher: EventDispatcher = get(EventDispatcher);

    public parseServerSpinResponse(response: ISpinResponse): void {
        this.parseReels(response.reels);
        this.rewardsModel.parse(response);
    }

    public parseServerInitResponse(response: IInitResponse): void {
        this.parseReels(response.reels);
        this.parseLines(response.lines);
    }

    private parseReels(reels: IServerReelsResponse): void {
        if (reels) {
            if (reels.stopPositions) {
                this._stopReelsPosition = reels.stopPositions;
            }
            if (reels.tapes) {
                this._tapes = reels.tapes.concat();
                this.dispatcher.dispatch(SlotEvent.NEW_REELS_TAPES_RECEIVED);
            }
        }
    }

    private parseLines(lines: number[][]): void {
        if (lines) {
            this._lines = lines.concat();
        }
    }

    public getStopReelsPosition(): number[] {
        return this._stopReelsPosition;
    }

    public set state(state: SlotState) {
        if (this._currentSlotState !== state) {
            this._currentSlotState = state;
            this.dispatcher.dispatch(SlotEvent.SLOT_STATE_CHANGED);
        }
    }

    public get state(): SlotState {
        return this._currentSlotState;
    }

    public get tapes(): number[][] {
        return this._tapes;
    }

    public get lines(): number[][] {
        return this._lines;
    }
}

export const enum SlotState {
    Idle,
    Spin,
    ShowWin
}