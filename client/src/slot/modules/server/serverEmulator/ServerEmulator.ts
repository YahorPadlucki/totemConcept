import {IServer} from "../IServer";
import {ISpinResponse} from "../interfaces/ISpinResponse";
import {IInitResponse} from "../interfaces/IInitResponse";

export class ServerEmulator implements IServer {

    private spinRequestTimeout: any;
    private initTimeout: any;

    private spinResponses: ISpinResponse[];
    private initResponse: IInitResponse;

    constructor() {
        console.log("Constructing ");
    }

    public init(initResponse: IInitResponse, spinResponses: ISpinResponse[]) {
        this.initResponse = initResponse;
        this.spinResponses = spinResponses;
    }

    initRequest(): Promise<IInitResponse> {
        return new Promise(resolve => {
            clearTimeout(this.initTimeout);
            this.initTimeout = setTimeout(() => {
                resolve(this.initResponse);
            }, 500);
        });
    }

    spinRequest(): Promise<ISpinResponse> {
        return new Promise(resolve => {
            clearTimeout(this.spinRequestTimeout);
            this.spinRequestTimeout = setTimeout(() =>
                resolve(this.spinResponses[Math.floor(Math.random() * this.spinResponses.length)]), 500);
        });
    }

}