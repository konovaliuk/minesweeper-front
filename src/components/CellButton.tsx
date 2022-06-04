import { Button } from "@chakra-ui/react";
import React from "react";
import Cell from "../types/Cell";

type Props = {
    isDisabled: boolean
    onClick: (e: React.MouseEvent<HTMLButtonElement>, i: number, j: number) => void
    i: number
    j: number
    cell: Cell | null
    minedNeighbours: number
}

export default function CellButton({ isDisabled, onClick, i, j, cell, minedNeighbours }: Props) {
    // console.log({ minedNeighbours });

    if (!cell) return (
        <Button
            isDisabled={isDisabled} _focus={{}}
            bg={'#CCC'} onClick={(e) => onClick(e, i, j)}
        />
    );

    let cellTag: string | number;
    if (cell.isDiscovered) {
        if (cell.isMined) cellTag = "💣";
        else cellTag = minedNeighbours > 0 ? minedNeighbours : "";
    } else cellTag = cell.isFlagged ? "🚩" : "";

    return (
        <Button
            isDisabled={isDisabled}
            _hover={{bg: (cell.isDiscovered ? "" : "#E2E8F0")}}
            _active={{bg: (cell.isDiscovered ? "" : "#CBD5E0")}}
            _focus={{}}
            p={0} bg={cell.isDiscovered ? '#777' : '#CCC'}
            onClick={(e) => onClick(e, i, j)}
        >
            {cellTag}
        </Button>
    );
}