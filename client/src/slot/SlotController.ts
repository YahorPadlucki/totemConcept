import {
    SceneID,
    SlotView
} from "./SlotView";
import {EventDispatcher} from "./modules/utils/dispatcher/EventDispatcher";
import {SlotEvent} from "./SlotEvent";
import {IServer} from "./modules/server/IServer";
import {ServerEmulator} from "./modules/server/serverEmulator/ServerEmulator";
import {
    SlotModel,
    SlotState
} from "./SlotModel";
import {get} from "./modules/utils/locator/locator";
import {ISpinResponse} from "./modules/server/interfaces/ISpinResponse";
import {RewardsModel} from "./modules/rewards/RewardsModel";
import {RewardsManager} from "./modules/rewards/RewardsManager";
import {LoadingManagerEvent} from "./modules/loader/events/LoaderEvent";

export class SlotController {

    private server: IServer = get(ServerEmulator);
    private slotModel: SlotModel = get(SlotModel);
    private rewardsModel: RewardsModel = get(RewardsModel);
    private rewardsManager: RewardsManager = get(RewardsManager);

    private dispatcher: EventDispatcher = get(EventDispatcher);

    constructor(private view: SlotView) {
        this.dispatcher.addListener(LoadingManagerEvent.MAIN_ASSETS_LOADED, () => this.onMainAssetsLoaded());
    }

    private onSpinClicked(): void {
        this.rewardsManager.cancelShowWinnings();
        this.slotModel.state = SlotState.Spin;
        this.server.spinRequest().then((serverResponse: ISpinResponse) => this.handleServerSpinResponse(serverResponse));
    }

    private onReelsStopped(): void {
        if (this.rewardsModel.totalWin > 0) {
            this.slotModel.state = SlotState.ShowWin;
            this.rewardsManager.showWinnings();
        }

        this.slotModel.state = SlotState.Idle;

    }

    private handleServerSpinResponse(serverResponse: ISpinResponse): void {
        this.slotModel.parseServerSpinResponse(serverResponse);

        this.dispatcher.dispatch(SlotEvent.SERVER_SPIN_RESPONSE_RECEIVED);
    }

    public showLoadinScene(): void {
        this.view.showScene(SceneID.LOADING_SCENE);
    }

    private onMainAssetsLoaded(): void {
        this.view.showScene(SceneID.REELS_SCENE);
        this.dispatcher.addListener(SlotEvent.SPIN_CLICK, this.onSpinClicked, this);
        this.dispatcher.addListener(SlotEvent.REELS_STOPPED, this.onReelsStopped, this);
    }
}
