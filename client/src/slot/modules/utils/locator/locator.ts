let objectsMap: { [constructorId: string]: any } = {};

export const get = <T>(constructor: { new() }): T => {
    if (!objectsMap[constructor.toString()]) {
        objectsMap[constructor.toString()] = new constructor();
    }
    return objectsMap[constructor.toString()];
};
