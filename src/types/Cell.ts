export default class Cell {
    readonly isMined: boolean
    readonly isDiscovered: boolean
    readonly isFlagged: boolean

    constructor(isMined: boolean,
                isDiscovered: boolean = false,
                isFlagged: boolean = false) {
        this.isMined = isMined;
        this.isDiscovered = isDiscovered
        this.isFlagged = isFlagged
    }

    withDiscovered(isDiscovered: boolean = true): Cell {
        return new Cell(this.isMined, isDiscovered, this.isFlagged)
    }

    withFlagged(isFlagged: boolean): Cell {
        return new Cell(this.isMined, this.isDiscovered, isFlagged)
    }

    withFlagToggled(): Cell {
        return this.withFlagged(!this.isFlagged);
    }

    clone(): Cell {
        return new Cell(this.isMined, this.isDiscovered, this.isFlagged);
    }
}