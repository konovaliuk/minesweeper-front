import { Box, Button, Heading, HStack } from "@chakra-ui/react";

type Props = {
    gameState?: "IN_PROGRESS" | "WON" | "LOST"
}

export default function GameState({ gameState }: Props) {
    const restart = () => window.location.reload();

    return (<>{
        (gameState === "LOST" && <HStack>
            <Heading textColor="red">Game Over</Heading>
            <Button onClick={restart}>Restart</Button>
        </HStack>) ||
        (gameState === "WON" && <HStack>
            <Heading textColor="rgb(0, 200, 0)">Victory!</Heading>
            <Button onClick={restart}>Restart</Button>
        </HStack>) ||
        <Box h="2.7em"/>
    }</>);
}