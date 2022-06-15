import React, { useEffect, useState } from 'react';
import './styles/App.css';
import { Box, Text, useToast, VStack } from "@chakra-ui/react";
import Field from "./components/Field";
import GameSettings from "./components/GameSettings";
import Navbar from "./components/Navbar";
import GameState from "./components/GameState";
import useCookie from "react-use-cookie";
import { refreshLogin, sendGameResult, validateLogin } from "./util/requests";
import CellDto from "./types/dto/CellDto";

export default function App() {
    const [min, max] = [2, 30];
    const [width, setWidth] = useState(10);
    const [height, setHeight] = useState(10);
    const [fillPercentage, setFillPercentage] = useState(0.1);
    const [minesLeft, setMinesLeft] = useState(NaN);
    const [gameState, setGameState] = useState<"IN_PROGRESS" | "WON" | "LOST">();
    const [isLoggedIn, setLoggedIn] = useState<boolean>();
    const [getCells, setGetCells] = useState<() => CellDto[][]>(() => () => new Array<CellDto[]>(height));

    const [accessToken, setAccessToken] = useCookie("accessToken");
    const [refreshToken, setRefreshToken] = useCookie("accessToken");
    const [stayLogged,] = useCookie("stayLogged");

    const toast = useToast({ isClosable: true });

    useEffect(() => {
        if (accessToken) validateLogin(accessToken)
            .then((isValid) => {
                if (isValid) {
                    setLoggedIn(true);
                    return;
                }
                Boolean(stayLogged) && refreshLogin(refreshToken).then(({ at, rt }) => {
                    if (!at || !rt) return;
                    setAccessToken(at, {
                        days: 1,
                        Secure: true
                    });
                    setRefreshToken(rt, {
                        days: 1,
                        Secure: true
                    });
                });
            });
        else setLoggedIn(false);
    }, []);

    useEffect(() => {
        if (!(gameState === "WON" || gameState === "LOST") || isLoggedIn === undefined) return;

        if (gameState !== "WON" && gameState !== "LOST") {
            toast({
                status: "warning",
                position: "top",
                title: "Game is not finished"
            });
            return;
        }
        sendGameResult(accessToken, {
            gameState,
            cells: (getCells()),
            height,
            width
        }).then(
            (_resp) => {
                toast({
                    status: "success",
                    position: "top",
                    title: "Game saved"
                });
                document.dispatchEvent(new Event("game saved"));
            },
            (reason) => {
                toast({
                    status: "error",
                    position: "top",
                    title: "Something went wrong"
                });
                console.log(reason);
            }
        );
    }, [gameState]);

    return (<>
        <VStack>
            <Box mt={3}>
                <Navbar
                    isLoggedIn={isLoggedIn} setLoggedIn={setLoggedIn}
                    accessToken={accessToken} setAccessToken={setAccessToken} setRefreshToken={setRefreshToken}
                    settingsChild={
                        <GameSettings
                            width={width} height={height} min={min} max={max}
                            fillPercentage={fillPercentage} isActive={gameState !== undefined}
                            setWidth={setWidth} setHeight={setHeight}
                            setFillPercentage={setFillPercentage}
                        />
                    }/>
            </Box>
            <GameState gameState={gameState}/>
            <Text>Mines left: {isNaN(minesLeft) ? "?" : minesLeft}</Text>
            <Box display="inline-block">
                <Field
                    size={[width, height]} min={min} max={max}
                    isDisabled={gameState === "WON" || gameState === "LOST"}
                    fillPercentage={fillPercentage}
                    setMinesLeft={setMinesLeft}
                    setGameState={setGameState}
                    setGetCells={setGetCells}
                />
            </Box>
        </VStack>
    </>);
}
