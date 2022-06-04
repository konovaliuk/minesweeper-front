import React, { Dispatch, SetStateAction, useState } from 'react';
import './styles/App.css';
import { Box, Text, VStack } from "@chakra-ui/react";
import Field from "./components/Field";
import GameSettings from "./components/GameSettings";
import Navbar from "./components/Navbar";
import GameState from "./components/GameState";

const noAction = () => {};

export default function App() {
    const [min, max] = [2, 30];
    const [isActive, setIsActive] = useState(false);
    const [width, setWidth] = useState(10);
    const [height, setHeight] = useState(10);
    const [fillPercentage, setFillPercentage] = useState(0.1);
    const [minesLeft, setMinesLeft] = useState(NaN);
    const [gameOver, setGameOver] = useState(false);
    const [victory, setVictory] = useState(false);

    const [restart, setRestart]: [() => void, Dispatch<SetStateAction<() => void>>] = useState(() => noAction);

    return (<>
        <VStack>
            <Box mt={3}>
                <Navbar isLoggedIn={false} settingsChild={
                    <GameSettings
                        width={width} height={height} min={min} max={max}
                        fillPercentage={fillPercentage} isActive={isActive}
                        setWidth={setWidth} setHeight={setHeight}
                        setFillPercentage={setFillPercentage}
                    />
                }/>
            </Box>
            <GameState gameOver={gameOver} victory={victory} restart={restart}/>
            <Text>Mines left: {isNaN(minesLeft) ? "?" : minesLeft}</Text>
            <Box display="inline-block">
                <Field
                    size={[width, height]} min={min} max={max}
                    isDisabled={gameOver || victory}
                    fillPercentage={fillPercentage}
                    setIsActive={setIsActive}
                    setMinesLeft={setMinesLeft}
                    setGameOver={setGameOver}
                    setVictory={setVictory}
                    setRestart={setRestart}
                />
            </Box>
        </VStack>
    </>);
}
