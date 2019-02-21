export class Sound {
    private instance: Howl;

    constructor(instance: Howl) {
        this.instance = instance;
    }

    public play(loop: number = 0): void {
        if (loop !== 0) {
            if (loop > 0) {
                this.instance.loop(true, loop);
            } else {
                this.instance.loop(true);
            }

        }
        this.instance.play();
    }

    /*public playInstance(numLoops: number = 1, onCompleted: () => void): SoundInstance {
        return new SoundInstance(this.id, this.getSoundConfig(), numLoops, onCompleted);
    }*/

    public stop(): void {
        this.instance.stop();
    }

    public isPlaying(): boolean {
        return this.instance.playing();
    }

    public get loaded(): boolean {
        return this.instance.state() === "loaded";
    }

    get volume(): number {
        return this.instance.volume();
    }

    set volume(value: number) {
        this.instance.volume(value);
    }

    public mute(): void {
        this.instance.mute(true);
    }

    public unMute(): void {
        this.instance.mute(false);
    }

    public pause(): void {
        this.instance.pause();
    }

    public resume(): void {
        this.instance.play();
    }

}