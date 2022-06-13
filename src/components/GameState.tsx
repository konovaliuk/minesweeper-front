import { Box, Button, Heading, HStack } from "@chakra-ui/react";

type Props = {
    gameOver: boolean
    victory: boolean
}

export default function GameState({ gameOver, victory }: Props) {
    const restart = () => window.location.reload();

    return (<>{
        (gameOver && <HStack>
            <Heading textColor="red">Game Over</Heading>
            <Button onClick={restart}>Restart</Button>
        </HStack>) ||
        (victory && <HStack>
            <Heading textColor="rgb(0, 200, 0)">Victory!</Heading>
            <Button onClick={restart}>Restart</Button>
        </HStack>) ||
        <Box h="2.7em"/>
    }</>);
}