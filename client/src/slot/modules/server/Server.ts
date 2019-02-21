import {IServer} from "./IServer";
import {ISpinResponse} from "./interfaces/ISpinResponse";
import {IInitResponse} from "./interfaces/IInitResponse";

export class Server implements IServer {
    initRequest(): Promise<IInitResponse> {
        return undefined;
    }
    spinRequest(): Promise<ISpinResponse> {
        throw new Error("Method not implemented.");
    }

}