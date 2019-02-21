import {FileLoader} from "./loaders/FileLoader";
import {SoundLoader} from "./loaders/SoundLoader";
import {EventDispatcher} from "../utils/dispatcher/EventDispatcher";
import {LoaderEvent} from "./events/LoaderEvent";
import {ImageLoader} from "./loaders/ImageLoader";
import {
    Asset,
    FileType
} from "./LoadingManager";
import {DeviceUtils} from "../utils/DeviceUtils";

export class Loader extends EventDispatcher {

    private isLoading: boolean;
    private hasLoaded: boolean;

    private loadingQueue: FileLoader[] = [];
    private totalFilesToLoadCount: number;

    private currentFileInProgress: FileLoader;

    public startLoading(): void {
        if (this.isLoading) {
            return;
        }

        this.totalFilesToLoadCount = this.loadingQueue.length;
        this.hasLoaded = false;
        this.isLoading = true;

        // this.updateProgress();

        if (this.loadingQueue.length) {
            this.loadNexFileInQueue();
        } else {
            this.completeLoading();
        }
    }

    public addAsset(asset: Asset) {
        switch (asset.type) {
            case FileType.Sound:
                this.addSound(asset.id, asset.url);
                break;

            case FileType.Image:
            case FileType.Atlas:
                this.addImage(asset.id, asset.url);
                break;
        }
    }

    private addSound(id: string, url: string): void {

        const soundLoader = this.getSoundLoaderByUrl(url);
        if (!soundLoader) {
            this.loadingQueue.push(new SoundLoader(id, url));
        } else {
            soundLoader.addId(id);
        }
    }

    private addImage(id: string, url: string) {
        url = url.replace("{dpi}", DeviceUtils.density);
        this.loadingQueue.push(new ImageLoader(id, url));
    }

    private getSoundLoaderByUrl(url: string): SoundLoader {
        return this.loadingQueue.filter((fileLoader: FileLoader) => fileLoader.url === url)[0] as SoundLoader;
    }

    //TODO: load one by one, try load all together
    private loadNexFileInQueue(): void {
        if (this.loadingQueue.length) {
            this.currentFileInProgress = this.loadingQueue.shift();
            this.currentFileInProgress.addListener(LoaderEvent.FILE_LOADED, this.onFileLoaded, this);
            this.currentFileInProgress.load();
        }
    }

    private onFileLoaded(url: string): void {
        this.currentFileInProgress.removeListener(LoaderEvent.FILE_LOADED, this.onFileLoaded, this);
        this.dispatch(LoaderEvent.FILE_LOADED);

        if (!this.loadingQueue.length) {
            this.completeLoading();
        } else {
            this.loadNexFileInQueue();
        }

    }

    private completeLoading(): void {
        this.isLoading = false;
        this.hasLoaded = true;

        this.dispatch(LoaderEvent.ALL_FILES_LOADED);
    }

    public totalFilesCount(): number {
        return this.totalFilesToLoadCount;
    }

    public filesLeftCount(): number {
        return this.loadingQueue.length;
    }

}
