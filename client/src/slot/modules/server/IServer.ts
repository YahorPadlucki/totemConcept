
import {ISpinResponse} from "./interfaces/ISpinResponse";
import {IInitResponse} from "./interfaces/IInitResponse";

export interface IServer {
    initRequest(): Promise<IInitResponse>;
    spinRequest(): Promise<ISpinResponse>;
}