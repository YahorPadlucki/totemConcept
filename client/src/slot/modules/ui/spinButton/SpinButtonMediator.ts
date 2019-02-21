import {SpinButton} from "./SpinButton";
import {EventDispatcher} from "../../utils/dispatcher/EventDispatcher";
import {
    KeyBoardEvent,
    SlotEvent
} from "../../../SlotEvent";
import {StopButton} from "./StopButton";
import {
    SlotModel,
    SlotState
} from "../../../SlotModel";
import {get} from "../../utils/locator/locator";

export class SpinButtonMediator {

    private slotModel: SlotModel = get(SlotModel);
    private dispatcher: EventDispatcher = get(EventDispatcher);

    constructor(private spinButton: SpinButton, private stopButton: StopButton) {
        this.spinButton.on('pointerdown', this.onSpinClick, this);
        this.stopButton.on('pointerdown', this.onStopClick, this);

        this.dispatcher.addListener(KeyBoardEvent.SPACE_DOWN, this.onSpacePressed, this);

        this.dispatcher.addListener(SlotEvent.SLOT_STATE_CHANGED, this.onSlotStateChanged, this);

        this.dispatcher.addListener(SlotEvent.SLOT_STATE_CHANGED, this.onSlotStateChanged, this);
        this.dispatcher.addListener(SlotEvent.SERVER_SPIN_RESPONSE_RECEIVED, this.onServerResponse, this);

        this.disableStop();
        this.enableSpin();
    }

    private enableSpin(): void {
        this.spinButton.enable();
    }

    private disableSpin(): void {
        this.spinButton.disable();
    }

    private enableStop(): void {
        this.stopButton.enable();
        this.stopButton.visible = true;

    }

    private disableStop(): void {
        this.stopButton.disable();
        this.stopButton.visible = false;
    }

    private onSpinClick(): void {
        this.disableSpin();
        this.dispatcher.dispatch(SlotEvent.SPIN_CLICK);
    }

    onServerResponse(): void {
        this.enableStop();
    }

    onSlotStateChanged(): void {
        if (this.slotModel.state === SlotState.Idle || this.slotModel.state === SlotState.ShowWin) {
            this.disableStop();
            this.enableSpin();
        }
        /*  if (this.slotModel.state === SlotState.ShowWin) {
              this.disableStop();
          }*/
    }

    private onSpacePressed(): void {
        if (this.spinButton.isEnabled()) {
            this.onSpinClick();
        }

        if (this.stopButton.isEnabled()) {
            this.onStopClick();
        }
    }

    private onStopClick(): void {
        this.disableStop();
        this.dispatcher.dispatch(SlotEvent.STOP_CLICK);
    }
}