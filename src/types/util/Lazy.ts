export default class Lazy<T> {
    private _value: T | undefined
    private readonly _supplier: () => T;

    constructor(supplier: () => T) {
        this._supplier = supplier;
    }

    get value(): T {
        if (!this._value) this._value = this._supplier();
        return this._value;
    }

    map<U>(mapper: (old: T) => U): Lazy<U> {
        return new Lazy(() => mapper(this.value));
    }

    flatMap<U>(mapper: (old: T) => Lazy<U>): Lazy<U> {
        return this.map(t => mapper(t).value);
    }
}