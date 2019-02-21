export class SlotConfig {
    minSlotWidth: number;
    minSlotHeight: number;
    reels: IReelsConfig;
}

export interface IReelsConfig {
    reelsCount: number;
    rowsCount: number;
    maxSpinSpeed: number;
    gapBetweenReels: number;
    gapBetweenRows: number;
    visibleHeight: number;
}