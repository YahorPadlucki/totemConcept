export class EventMap {
    constructor(public readonly event: string,
                public readonly eventListener: EventListener,
                public readonly scope: Object) {
    }

}