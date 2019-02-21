import {IServerReelsResponse} from "./ServerResponseInterfaces";

export interface IInitResponse {
    lines: number[][];
    reels: IServerReelsResponse
}