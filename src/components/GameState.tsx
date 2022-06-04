import { Box, Button, Heading, HStack } from "@chakra-ui/react";

type Props = {
    gameOver: boolean
    victory: boolean
    restart: () => void
}

export default function GameState({ gameOver, victory, restart }: Props) {
    return (<>
        {
            (gameOver && <HStack>
                <Heading textColor="red">Game Over</Heading>
                <Button onClick={restart}>Restart</Button>
            </HStack>) ||
            (victory && <HStack>
                <Heading textColor="rgb(0, 200, 0)">Victory!</Heading>
                <Button onClick={restart}>Restart</Button>
            </HStack>) ||
            <Box h="2.7em"/>
        }
    </>);
}