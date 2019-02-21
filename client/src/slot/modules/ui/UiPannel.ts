import Container = PIXI.Container;
import Graphics = PIXI.Graphics;
import {StopButton} from "./spinButton/StopButton";
import {SpinButton} from "./spinButton/SpinButton";
import {SpinButtonMediator} from "./spinButton/SpinButtonMediator";
import {WinFieldView} from "./winField/WinFieldView";
import {WinFieldMediator} from "./winField/WinFieldMediator";

export class UiPanel extends Container {

    private spinButton: SpinButton;
    private stopButton: StopButton;
    private spinButtonMediator: SpinButtonMediator;

    private winFieldView: WinFieldView;
    private winFieldMediator: WinFieldMediator;

    private panelHeight: number = 100;
    private panelWidth: number = 800;

    constructor() {
        super();
        this.spinButton = new SpinButton();
        this.stopButton = new StopButton();
        this.spinButtonMediator = new SpinButtonMediator(this.spinButton, this.stopButton);

        this.stopButton.y = this.spinButton.y = this.panelHeight / 2;
        this.stopButton.x = this.spinButton.x = this.panelWidth - this.spinButton.width;

        this.winFieldView = new WinFieldView();
        this.winFieldMediator = new WinFieldMediator(this.winFieldView);

        this.winFieldView.x = this.panelWidth / 2;
        this.winFieldView.y = this.panelHeight / 2;

        const back = new Graphics();
        back.beginFill(0x706F6D, 0.5);
        back.drawRect(0, 0, this.panelWidth, this.panelHeight);
        back.endFill();

        this.addChild(back);

        this.addChild(this.spinButton);
        this.addChild(this.stopButton);

        this.addChild(this.winFieldView);

    }

    onResize(): void {
        // this.spinButton.x = this.minWidth / 2 - this.spinButton.width / 2;
        // this.spinButton.y = this.minHeight / 2 - this.spinButton.height / 2;
    }
}