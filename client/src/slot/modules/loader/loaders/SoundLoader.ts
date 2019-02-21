import {
    FileLoader
} from "./FileLoader";
import {SoundManager} from "../../sound/SoundManager";
import {get} from "../../utils/locator/locator";
import {Sound} from "../../sound/Sound";

export class SoundLoader extends FileLoader {

    private idList: string[];
    private sound: Howl;

    private soundManager: SoundManager = get(SoundManager);

    private readonly LOAD_EVENT_NAME: string = "load";
    private readonly LOAD_EVENT_ID: number = 1;

    private readonly LOAD_ERROR_EVENT_NAME: string = "loaderror";
    private readonly LOAD_ERROR_EVENT_ID: number = 2;

    constructor(id: string, url: string) {
        super(url);

        this.idList = [id];
    }

    addId(id: string) {
        this.idList.push(id);
    }

    load() {
        this.sound = new Howl({src: [this.getSoundUrl(this._url, "ogg"), this.getSoundUrl(this._url, "mp3")]});

        this.sound.on(this.LOAD_EVENT_NAME, () => this.loadCompleteHandler(), this.LOAD_EVENT_ID);
        this.sound.on(this.LOAD_ERROR_EVENT_NAME, () => this.loadErrorHandler("sound " + this.idList[0]), this.LOAD_ERROR_EVENT_ID);
    }

    protected loadCompleteHandler(event?) {

        for (const id of this.idList) {
            this.soundManager.setSound(id, new Sound(this.sound));
        }

        super.loadCompleteHandler();
    }

    protected resetLoader() {
        this.sound.off(this.LOAD_EVENT_NAME, null, this.LOAD_EVENT_ID);
        this.sound.on(this.LOAD_ERROR_EVENT_NAME, null, this.LOAD_ERROR_EVENT_ID); //TODO: Howler doesn't remove event by function
    }

    private getSoundUrl(src: string, extension: string): string {
        return src.replace("{type}", extension);
    }
}
