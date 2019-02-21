import Texture = PIXI.Texture;

export class LoaderCache {

    private imageCache: { [key: string]: Texture; } = {};

    public addTexture(id: string, texture: Texture) {

        if (!this.imageCache[id]) {
            this.imageCache[id] = texture;
        }
    }

    public getTexture(id: string): Texture {
        return this.imageCache[id];
    }
}