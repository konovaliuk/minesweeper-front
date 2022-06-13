import {
    FormControl,
    FormLabel,
    InputGroup,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper
} from "@chakra-ui/react";
import React from "react";

type Props = {
    isActive: boolean
    width: number
    height: number
    min: number
    max: number
    fillPercentage: number
    setWidth: (width: number) => void
    setHeight: (height: number) => void
    setFillPercentage: (fillPercentage: number) => void
}

export default function GameSettings({
                                         isActive,
                                         width,
                                         height,
                                         min, max,
                                         fillPercentage,
                                         setWidth, setHeight,
                                         setFillPercentage
                                     }: Props) {
    return (
        <FormControl isDisabled={isActive} display="inline-block">
            <FormLabel>Size</FormLabel>
            <InputGroup>
                <NumberInput
                    defaultValue={width} min={min} max={max} step={1} allowMouseWheel
                    onChange={(str, width) =>
                        str !== "" && !isNaN(width) && min <= width && width <= max && setWidth(width)
                    }
                >
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
                <NumberInput
                    defaultValue={height} min={min} max={max} step={1} allowMouseWheel
                    onChange={(str, height) =>
                        str !== "" && !isNaN(height) && min <= height && height <= max && setHeight(height)
                    }
                >
                    <NumberInputField/>
                    <NumberInputStepper>
                        <NumberIncrementStepper/>
                        <NumberDecrementStepper/>
                    </NumberInputStepper>
                </NumberInput>
            </InputGroup>
            <FormLabel mt={3}>Fill Percentage</FormLabel>
            <NumberInput
                defaultValue={fillPercentage} min={0} max={1} step={0.05} allowMouseWheel
                onChange={(str, fillPercentage) =>
                    str !== "" && !isNaN(fillPercentage) && 0 <= fillPercentage && fillPercentage <= 1 && setFillPercentage(fillPercentage)
                }
            >
                <NumberInputField/>
                <NumberInputStepper>
                    <NumberIncrementStepper/>
                    <NumberDecrementStepper/>
                </NumberInputStepper>
            </NumberInput>
        </FormControl>
    );
}