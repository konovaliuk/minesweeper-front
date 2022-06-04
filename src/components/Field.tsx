import { Box, Center, HStack, VStack } from "@chakra-ui/react";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Cell from "../types/Cell";
import CellButton from "./CellButton";
import Set from "../types/util/Set";

type Props = {
    min: number
    max: number
    isDisabled: boolean
    size: [number, number]
    fillPercentage: number
    setIsActive: (isActive: boolean) => void
    setMinesLeft: (minesLeft: number) => void
    setGameOver: (gameOver: boolean) => void
    setVictory: (victory: boolean) => void
    setRestart: Dispatch<SetStateAction<() => void>>
}

export default function Field({
                                  min, max,
                                  size: [height, width],
                                  isDisabled,
                                  fillPercentage,
                                  setIsActive, setMinesLeft,
                                  setGameOver, setVictory,
                                  setRestart
                              }: Props) {
    if (height < min || height > max || width < min || width > max) throw new Error("Invalid size");
    if (fillPercentage < 0 || fillPercentage > 1) throw new Error("Invalid fill percentage");

    const firstCells = (): Cell[][] => {
        const cells = new Array<Cell[]>(height);
        for (let i = 0; i < height; i++) cells[i] = new Array<Cell>(width);
        return cells;
    }

    const [cells, setCells] = useState<Cell[][]>(firstCells());
    useEffect(() => setCells(firstCells()), [width, height]);

    const [wasLeftClicked, setWasLeftClicked] = useState(false);

    const [minesTotal, setMinesTotal] = useState(NaN);

    const initialize = (i: number, j: number) => {
        if (i < 0 || i >= height || j < 0 || j >= width) throw new Error("Invalid coordinates");

        const newCells: Cell[][] = new Array<Cell[]>(height);
        for (let i_ = 0; i_ < height; i_++) {
            newCells[i_] = new Array<Cell>(width);
            for (let j_ = 0; j_ < width; j_++)
                newCells[i_][j_] = new Cell(Math.random() < fillPercentage && !(i_ === i && j_ === j));
        }

        setCells(discover([i, j], next([i, j], newCells), Set.empty(), newCells));
        setIsActive(true);

        let mines = 0;
        for (let i_ = 0; i_ < height; i_++) for (let j_ = 0; j_ < width; j_++)
            mines += newCells[i_][j_].isMined ? 1 : 0;
        setMinesLeft(mines);
        setMinesTotal(mines);
    }


    const discover = ([i, j]: [number, number],
                      rest: Set<[number, number]>,
                      done: Set<[number, number]>,
                      result: Cell[][]): Cell[][] => {
        const nextResult: Cell[][] = new Array<Cell[]>(height);
        for (let i_ = 0; i_ < height; i_++) {
            nextResult[i_] = new Array<Cell>(width);
            for (let j_ = 0; j_ < width; j_++) {
                nextResult[i_][j_] = i_ === i && j_ === j
                    ? result[i_][j_].withDiscovered()
                    : result[i_][j_].clone();
            }
        }
        const newDone = done.with([i, j]);
        const newRest = rest.union(next([i, j], nextResult)).difference(newDone);
        if (newRest.isEmpty()) return nextResult;
        return discover(newRest.head(), newRest.tail(), newDone, nextResult);
    };

    const next = ([i, j]: [number, number], field: Cell[][] = cells): Set<[number, number]> => {
        const next = collectNeighbours(i, j);
        // если есть минированные соседи, то их автоматически раскрывать не будет
        return numberOfMinedNeighbours(i, j, field) > 0 || field[i][j].isMined
            ? Set.empty()
            : new Set(next);
    };

    const toggleFlag = (i: number, j: number) => {
        const newCells: Cell[][] = new Array<Cell[]>(height);
        for (let i_ = 0; i_ < height; i_++) {
            newCells[i_] = new Array<Cell>(width);
            for (let j_ = 0; j_ < width; j_++) {
                newCells[i_][j_] = i_ === i && j_ === j
                    ? cells[i_][j_].withFlagToggled()
                    : cells[i_][j_].clone();
            }
        }
        setCells(newCells);

        let flagged = 0;
        for (let i_ = 0; i_ < height; i_++) for (let j_ = 0; j_ < width; j_++)
            flagged += newCells[i_][j_].isFlagged ? 1 : 0;
        setMinesLeft(minesTotal - flagged);
    };

    const collectNeighbours = (i: number, j: number): [number, number][] => {
        const neighbours: [number, number][] = [];
        for (let i_ = i - 1; i_ <= i + 1; i_++) {
            if (i_ < 0 || i_ >= height) continue;
            for (let j_ = j - 1; j_ <= j + 1; j_++) {
                if (j_ < 0 || j_ >= width) continue;
                if (!(i_ === i && j_ === j)) neighbours.push([i_, j_]);
            }
        }
        return neighbours;
    }

// works
    const numberOfMinedNeighbours = (i: number, j: number, field: Cell[][] = cells): number => {
        const next = collectNeighbours(i, j);
        return next.reduce(
            (prev, [i_, j_]) => field[i_][j_].isMined ? prev + 1 : prev,
            0
        );
    };

    const testVictory = () => {
        // если раскрыты все не мины а все мины под флагом, то победа
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (!cells[i][j]) return;
                if (!cells[i][j].isDiscovered && !cells[i][j].isMined) return;
                if (cells[i][j].isMined && !cells[i][j].isFlagged) return;
            }
        }
        setVictory(true);
    }

    useEffect(testVictory, [cells]);

    const onClick = (e: React.MouseEvent<HTMLButtonElement>, i: number, j: number) => {
        if (e.button !== 0) return;

        if (!e.shiftKey) {
            console.log("No shift key - no flag");
            if (!wasLeftClicked) {
                setWasLeftClicked(true);
                initialize(i, j);
                return;
            }
            if (cells[i][j].isFlagged) return;
            setCells(discover([i, j], next([i, j]), Set.empty(), cells));
            if (cells[i][j].isMined) {
                setGameOver(true);
                return;
            }
            return;
        }
        if (wasLeftClicked) {
            console.log("shift key && was left clicked - flag");
            if (!cells[i][j].isDiscovered) toggleFlag(i, j);
        }
    };

    const nullArray = (length: number): null[] => {
        const res: null[] = []
        for (let i = 0; i < length; i++) res.push(null);
        return res;
    }

    return (<>
        <Center>
            <Box background={'#777'} padding='0.5em' borderRadius='0.5em'>
                <VStack>{cells.map((row, i) =>
                    <HStack key={`row_${i}`}>
                        {(wasLeftClicked ? row : nullArray(row.length)).map((cell: Cell | null, j) =>
                            <CellButton
                                isDisabled={isDisabled}
                                key={`cell_${i}_${j}`}
                                i={i} j={j}
                                cell={cell}
                                onClick={onClick}
                                minedNeighbours={cell ? numberOfMinedNeighbours(i, j) : 0}
                            />)}
                    </HStack>)}
                </VStack>
            </Box>
        </Center>
    </>);
}