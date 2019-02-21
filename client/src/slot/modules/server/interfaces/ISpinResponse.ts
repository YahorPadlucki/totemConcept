import {IServerReelsResponse, IServerRewardsResponse} from "./ServerResponseInterfaces";

export interface ISpinResponse {
    totalWin?: number;
    reels: IServerReelsResponse;
    rewards: IServerRewardsResponse [];
}