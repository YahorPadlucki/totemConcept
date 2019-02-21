import {IInitResponse} from "../interfaces/IInitResponse";
import {ISpinResponse} from "../interfaces/ISpinResponse";

export interface IConfigJson {
    init: IInitResponse;
    spins: ISpinResponse[];
}