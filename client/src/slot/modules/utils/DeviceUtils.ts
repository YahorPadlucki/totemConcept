export class DeviceUtils {

    public static density: string = "";

    private data = {
        density: {
            ldpi: 0.5,
            mdpi: 0.6,
            hdpi: 0.75,
            xhdpi: 1
        },
        safeArea: {
            width: 1180,
            height: 680
        },
        padding: {
            top: 0,
            right: 0,
            bottom: 90,
            left: 0
        },
        densityKey: "xhdpi"

    };

    public init(): void {
        const {devicePixelRatio} = window;
        const {availWidth, availHeight} = window.screen;

        const deviceLongSide = Math.max(availHeight, availWidth) * devicePixelRatio;
        const deviceShortSide = Math.min(availHeight, availWidth) * devicePixelRatio;
        // this.aspectRatio = this.deviceLongSide / this.deviceShortSide;

        DeviceUtils.density = this.setDensity(deviceShortSide, deviceLongSide);
        console.log("====Density ", DeviceUtils.density);

    }

    private setDensity(deviceShortSide: number, deviceLongSide): string {
        const {top, right, bottom, left} = this.data.padding;
        const {width, height} = this.data.safeArea;
        const {density} = this.data;

        const minScale: number = Math.min(
            (deviceLongSide - left - right) / width,
            (deviceShortSide - top - bottom) / height
        );

        const densityKeys: string[] = Object.keys(density);
        let resultDensity: string = "";
        for (let i: number = 0; i < densityKeys.length; i++) {
            const densityValue: number = density[densityKeys[i]];
            if (densityValue >= minScale) {
                const densityIndex = Math.max(0, i - 1);
                resultDensity = densityKeys[densityIndex];
                break;
            }

            resultDensity = densityKeys[i];
        }

        return resultDensity;
    }
}