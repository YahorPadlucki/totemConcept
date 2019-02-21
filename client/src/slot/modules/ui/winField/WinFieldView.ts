import Container = PIXI.Container;
import Text = PIXI.Text;

export class WinFieldView extends Container {
    private text: Text;

    private idleText: string = "Good Luck!";

    constructor() {
        super();

        const style = new PIXI.TextStyle({
            align: 'center',
            fill: '#ffda28',
            fontFamily: 'Arial',
            fontSize: 50,
            fontWeight: 'bold'
        });

        this.text = new Text("00.00");
        this.text.style = style;
        this.text.x = -this.text.width / 2;
        this.text.y -= this.text.height / 2;
        this.addChild(this.text);
    }

    public showTotalWin(totalWin: number): void {

        this.text.text = totalWin.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2

        });

        this.align();
    }

    public showIdleLabel(): void {
        this.text.text = this.idleText;
        this.align();
    }

    private align() {
        this.text.x = -this.text.width / 2;
    }
}
