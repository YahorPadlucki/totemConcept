export interface IServerReelsResponse {
    stopPositions?: number[];
    tapes?: number[][];
}

export interface IServerRewardsResponse {
    lineId: number;
    linePayout: number;
    symbolsCount: number;
}