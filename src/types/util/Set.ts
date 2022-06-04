export default class Set<T> {
    private readonly contents: T[]

    constructor(initArray: T[]) {
        this.contents = new Array<T>();
        for (const t of initArray)
            if (!this.contains(t)) this.contents.push(t);
    }

    toArray(): T[] {
        return this.contents;
    }

    contains(value: T): boolean {
        for (const element of this.contents) if (Set.isEqual(element, value)) return true;
        return false;
    }

    head(): T {
        return this.contents[0];
    }

    tail(): Set<T> {
        return new Set(this.contents.slice(1))
    }

    with(value: T): Set<T> {
        return new Set(this.contents.concat([value]))
    }

    union(other: Set<T>): Set<T> {
        return new Set(this.contents.concat(other.contents));
    }

    difference(other: Set<T>): Set<T> {
        return new Set(this.contents.filter((val) => !other.contains(val)));
    }

    isEmpty(): boolean {
        return this.contents.length === 0;
    }

    static empty<T>(): Set<T> {
        return new Set<T>([]);
    }

    private static isEqual(a?: any, b?: any): boolean {
        if (a === b) return true;
        if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
        if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b;
        if (Object.is(a, null) || Object.is(a, undefined) ||
            Object.is(b, null) || Object.is(b, undefined)) return false;
        if (a.prototype !== b.prototype) return false;
        let keys = Object.keys(a);
        if (keys.length !== Object.keys(b).length) return false;
        return keys.every(k => Set.isEqual(a[k], b[k]));
    };
}