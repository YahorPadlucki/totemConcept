import {Loader} from "./Loader";
import {
    LoaderEvent,
    LoadingManagerEvent
} from "./events/LoaderEvent";
import {EventDispatcher} from "../utils/dispatcher/EventDispatcher";
import {get} from "../utils/locator/locator";

export class LoadingManager {
    private preloadAssetsLoader: Loader = new Loader();
    private mainAssetsLoader: Loader = new Loader();

    private dispatcher: EventDispatcher = get(EventDispatcher);

    public loadResources(assetsJsonUrl: string): void {

        this.loadJson(assetsJsonUrl).then((data: AssetsJson) => this.onAssetsJsonLoaded(data));
    }

    public loadJson(url: string) {
        return new Promise((resolve, reject) => {
            fetch(url).then(result => {
                result.json().then(data => resolve(data));
            });
        });
    }

    private onAssetsJsonLoaded(data: AssetsJson): void {

        for (let assetId in data) {
            if (data.hasOwnProperty(assetId)) {

                this.getAssetsByPriority(data[assetId], AssetPriority.PRELOAD).forEach(asset => this.preloadAssetsLoader.addAsset(asset));
                this.getAssetsByPriority(data[assetId], AssetPriority.MAIN).forEach(asset => this.mainAssetsLoader.addAsset(asset));
            }
        }

        this.preloadAssetsLoader.addListener(LoaderEvent.ALL_FILES_LOADED, () => {
            this.dispatcher.dispatch(LoadingManagerEvent.PRELOAD_ASSETS_LOADED);
            this.mainAssetsLoader.startLoading();
        });

        this.preloadAssetsLoader.startLoading();

        this.mainAssetsLoader.addListener(LoaderEvent.ALL_FILES_LOADED, () => this.dispatcher.dispatch(LoadingManagerEvent.MAIN_ASSETS_LOADED));

        this.mainAssetsLoader.addListener(LoaderEvent.FILE_LOADED, () => {
            console.log("=== Main File loaded");

            const totalFiles: number = this.mainAssetsLoader.totalFilesCount();
            const loadedFiles: number = totalFiles - this.mainAssetsLoader.filesLeftCount();

            const loadedPercent = (loadedFiles / totalFiles) * 100;

            this.dispatcher.dispatch(LoadingManagerEvent.MAIN_ASSETS_LOAD_PROGRESS, loadedPercent);
        });

    }

    private getAssetsByPriority(assets: Asset[], priority: string): Asset[] {
        return assets.filter(assets => assets.priority === priority);
    }

    private getLazyAssets(assets: Asset[]): Asset[] {
        return assets.filter(assets => assets.priority === "");
    }

}

interface AssetsJson {
    sounds: Asset[];
    images: Asset[];
}

export const AssetPriority = {
    PRELOAD: "PRELOAD",
    MAIN: "MAIN"
};

export interface Asset {
    id: string;
    url: string;
    priority: string;
    type: string;
}

//TODO: as interface?
export const FileType = {
    Sound: "Sound",
    Image: "Image",
    Atlas: "Atlas"
};