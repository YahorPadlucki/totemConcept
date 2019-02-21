import {RewardVO} from "./RewardVO";
import {ISpinResponse} from "../server/interfaces/ISpinResponse";

export class RewardsModel {

    private _rewards: RewardVO[];
    private _totalWin: number;

    parse(response: ISpinResponse) {
        if (response.rewards) {
            this._rewards = [];
            response.rewards.forEach((reward) => {
                let rewardVO = new RewardVO();
                rewardVO.symbolsCount = reward.symbolsCount;
                rewardVO.lineId = reward.lineId;
                rewardVO.linePayout = reward.linePayout;

                this._rewards.push(rewardVO);
            });
        }
        if (response.totalWin) {
            this._totalWin = response.totalWin;
        }
    }

    get totalWin(): number {
        return this._totalWin;
    }

    get rewards(): RewardVO[] {
        return this._rewards;
    }
}