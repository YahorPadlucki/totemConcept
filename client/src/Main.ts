import {EventDispatcher} from "./slot/modules/utils/dispatcher/EventDispatcher";
import {SlotEvent} from "./slot/SlotEvent";
import {SlotView} from "./slot/SlotView";
import {SlotController} from "./slot/SlotController";
import {LoadingManager} from "./slot/modules/loader/LoadingManager";
import {get} from "./slot/modules/utils/locator/locator";
import {LoadingManagerEvent} from "./slot/modules/loader/events/LoaderEvent";
import {ServerEmulator} from "./slot/modules/server/serverEmulator/ServerEmulator";
import {IConfigJson} from "./slot/modules/server/serverEmulator/IConfigJson";
import {SlotConfig} from "./slot/SlotConfig";
import {DeviceUtils} from "./slot/modules/utils/DeviceUtils";
import {KeyboardManager} from "./slot/modules/utils/KeyboardManager";
import {SlotModel} from "./slot/SlotModel";
import {IInitResponse} from "./slot/modules/server/interfaces/IInitResponse";
import Ticker = PIXI.ticker;
import Point = PIXI.Point;
import Container = PIXI.Container;

export class Main {

    private renderer: PIXI.SystemRenderer;
    private stage: Container;

    private prevTime: number = 0;
    private fps: number = 60;
    private drawInterval: number;

    private slotView: SlotView;
    private slotController: SlotController;
    private slotModel: SlotModel = get(SlotModel);

    private server: ServerEmulator = get(ServerEmulator);
    private loadingManager: LoadingManager = get(LoadingManager);
    private slotConfig: SlotConfig = get(SlotConfig);

    private dispatcher: EventDispatcher = get(EventDispatcher);
    private deviceUtils: DeviceUtils = get(DeviceUtils);

    private keyBoardManager: KeyboardManager;

    constructor() {

        const width = this.getWidth();
        const height = this.getHeight();

        this.renderer = PIXI.autoDetectRenderer(width, height);
        document.body.appendChild(this.renderer.view);

        this.drawInterval = 1000 / this.fps;

        this.stage = new Container();

        this.dispatcher.addListener(LoadingManagerEvent.PRELOAD_ASSETS_LOADED, this.onPreloadAssetsLoaded, this);

        this.deviceUtils.init();

        this.keyBoardManager = get(KeyboardManager);

        this.loadingManager.loadJson('./config.json').then((config: SlotConfig) => {
            this.saveSlotConfig(config);
            this.prepareServerAndMakeInitRequest();
        });
    }

    private saveSlotConfig(config: SlotConfig): void {
        this.slotConfig.minSlotWidth = config.minSlotWidth;
        this.slotConfig.minSlotHeight = config.minSlotHeight;
        this.slotConfig.reels = config.reels;
    }

    private prepareServerAndMakeInitRequest(): void {
        this.loadingManager.loadJson('./emulation.json').then((emulationData: IConfigJson) => {
            this.server.init(emulationData.init, emulationData.spins);
            this.server.initRequest().then((initResponse: IInitResponse) => this.onInitResponse(initResponse));
        });
    }

    private onInitResponse(initResponse: IInitResponse): void {

        this.slotModel.parseServerInitResponse(initResponse);

        this.createSlotViewAndController();

        this.loadingManager.loadResources("./assets.json");
    }

    private createSlotViewAndController(): void {
        this.slotView = new SlotView(this.slotConfig.minSlotWidth, this.slotConfig.minSlotHeight);
        this.slotController = new SlotController(this.slotView);

        this.slotView.pivot = new Point(0.5, 0.5);

        this.stage.addChild(this.slotView);
    }

    private onPreloadAssetsLoaded(): void {

        console.log("=== preload assets loaded");

        this.slotController.showLoadinScene();

        this.onResize();

        window.addEventListener("resize", () => this.onResize(), true);

        Ticker.shared.add(this.onTickUpdate, this);

    }

    private onTickUpdate(): void {
        this.renderer.render(this.stage);
        const now = Date.now();

        if (this.prevTime === 0) {
            this.prevTime = now;
        }

        const deltaTime = now - this.prevTime;

        if (deltaTime > this.drawInterval) {
            this.dispatcher.dispatch(SlotEvent.ENTER_FRAME, deltaTime);
            this.prevTime = now;
            // this.prevTime = now - deltaTime % this.drawInterval;
        }
    }

    private onResize(): void {
        const width = this.getWidth();
        const height = this.getHeight();

        const canvas = this.renderer.view;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        this.renderer.resize(width, height);

        this.slotView.resize(width, height);
        this.slotView.x = width / 2;
        this.slotView.y = height / 2;
    }

    private getWidth(): number {
        return Math.max(document.documentElement.clientWidth, window.innerWidth);
    }

    private getHeight(): number {
        return document.documentElement.clientHeight;
    }
}

new Main();
