import {WinFieldView} from "./WinFieldView";
import {EventDispatcher} from "../../utils/dispatcher/EventDispatcher";
import {get} from "../../utils/locator/locator";
import {RewardsEvents} from "../../rewards/RewardsEvents";
import {SlotEvent} from "../../../SlotEvent";

export class WinFieldMediator {

    private dispatcher: EventDispatcher = get(EventDispatcher);

    protected visibleValue: number = 0;
    private totalWinToShow: number = 0;

    constructor(private view: WinFieldView) {
        this.view.showIdleLabel();
        this.dispatcher.addListener(RewardsEvents.SHOW_TOTAL_WIN, this.showTotalWin, this);
        this.dispatcher.addListener(SlotEvent.REELS_SPIN_STARTED, this.onReelsSpinStarted, this);

    }

    private onReelsSpinStarted(): void {

        TweenLite.killTweensOf(this);

        if (this.totalWinToShow > 0) {
            this.view.showTotalWin(this.totalWinToShow);
        }

        setTimeout(() => this.view.showIdleLabel(), 500);
        this.totalWinToShow = 0;
    }

    private showTotalWin(totalWin: number): void {
        this.totalWinToShow = totalWin;
        this.visibleValue = 0;
        TweenLite.killTweensOf(this);
        TweenLite.to(
            this,
            1,
            {
                visibleValue: totalWin,
                onUpdate: () => {
                    this.view.showTotalWin(this.visibleValue);
                },
                onComplete: () => {
                }
            }
        );
    }

}