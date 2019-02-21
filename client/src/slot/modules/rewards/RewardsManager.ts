import {RewardsModel} from "./RewardsModel";
import {get} from "../utils/locator/locator";
import {EventDispatcher} from "../utils/dispatcher/EventDispatcher";
import {SymbolEvents} from "../symbols/events/SymbolEvents";
import {IWinSymbolData} from "./interfaces/IWinSymbolData";
import {SlotModel} from "../../SlotModel";
import {RewardVO} from "./RewardVO";
import {RewardsEvents} from "./RewardsEvents";

export class RewardsManager {

    private rewardsModel: RewardsModel = get(RewardsModel);
    private slotModel: SlotModel = get(SlotModel);
    private dispatcher: EventDispatcher = get(EventDispatcher);

    private mainResolve: Function;
    private reject: Function;

    public showWinnings(): Promise<any> {
        return new Promise((resolve) => {
            this.mainResolve = resolve;

            // this.dispatcher.dispatch(RewardsEvents.SHOW_TOTAL_WIN, this.rewardsModel.totalWin);

            // this.dispatcher.addListener(SymbolEvents.BLINK_COMPLETE, this.onBlinkComplete, this);
            // this.dispatchWinningsDisplayEvent(SymbolEvents.BLINK);
            resolve();

        });
    }

    public cancelShowWinnings() {
        this.dispatchWinningsDisplayEvent(SymbolEvents.STOP_BLINK);
    }

    private dispatchWinningsDisplayEvent(event: string) {
        if (!this.rewardsModel.rewards) { return; }

        this.rewardsModel.rewards.forEach((rewardVO: RewardVO) => {
            const winLine: number[] = this.slotModel.lines[rewardVO.lineId];

            winLine.forEach((rowIndex, columnIndex) => {

                this.dispatcher.dispatch(event, <IWinSymbolData>{
                    columnIndex: columnIndex,
                    rowIndex: rowIndex
                });
            });
        });
    }

    private onBlinkComplete() {
        this.dispatcher.removeListener(SymbolEvents.BLINK_COMPLETE, this.onBlinkComplete, this);

        this.mainResolve();
    }

}