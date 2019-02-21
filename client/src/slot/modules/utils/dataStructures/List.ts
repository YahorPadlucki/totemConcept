export class List<T> {
    constructor(private list: T[] = []) {
    }

    public add(item: T): void {
        this.list.push(item);
    }

    public has(item: T): boolean {
        return this.list.indexOf(item) !== -1;
    }

    public remove(item: T): void {
        if (this.has(item)) {
            this.list.splice(this.list.indexOf(item), 1);
        }
    }

    public getByFilter<FilterType>(filter: FilterType): T[] {
        return this.filter(filter, false);
    }

    public removeByFilter<FilterType>(filter: FilterType): void {
        this.list = this.filter(filter, true);
    }

    private filter<Filter>(filter: Filter, isInverted: boolean = false): T[] {
        const result: T[] = [];

        this.list.forEach((item) => {
            if (this.isInList<Filter>(item, filter) !== isInverted) {
                result.push(item);
            }
        });

        return result;

    }

    private isInList<Filter>(item: T, filter: Filter): boolean {
        for (const property in filter) {
            if (filter.hasOwnProperty(property) && item.hasOwnProperty(property)) {

                if ((filter[property]) && filter[property] !== item[property as any]) {
                    return false;
                }

            }
        }
        return true;
    }

}