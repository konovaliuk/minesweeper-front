import {
    Button,
    Grid,
    GridItem,
    Heading,
    HStack,
    Kbd,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useDisclosure
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";

type Props = {
    isLoggedIn: boolean
    settingsChild: any
}

export default function Navbar({ isLoggedIn, settingsChild }: Props) {


    const { isOpen: isOpenSignIn, onOpen: onOpenSignIn, onClose: onCloseSignIn } = useDisclosure();
    const { isOpen: isOpenSignUp, onOpen: onOpenSignUp, onClose: onCloseSignUp } = useDisclosure();

    return (<>
        <Grid templateColumns='repeat(3, 1fr)' gap="10vw">
            <GridItem>
                <HStack>
                    <Menu>
                        <MenuButton _focus={{}} as={Button} rightIcon={<ChevronDownIcon/>}>
                            Controls
                        </MenuButton>
                        <MenuList>
                            <MenuItem _active={{}} _focus={{}}>Discover Cell: <Kbd ml={5}>Left Click</Kbd></MenuItem>
                            <MenuItem _active={{}} _focus={{}}>Flag Cell: <Kbd ml={5}>Shift</Kbd> + <Kbd>Left
                                Click</Kbd></MenuItem>
                        </MenuList>
                    </Menu>
                    <Menu closeOnSelect={false}>
                        <MenuButton _focus={{}} as={Button} rightIcon={<ChevronDownIcon/>}>
                            Settings
                        </MenuButton>
                        <MenuList>
                            <MenuItem _focus={{}}>{settingsChild}</MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </GridItem>
            <GridItem>
                <Heading>MINESWEEPER</Heading>
            </GridItem>
            <GridItem>
                {(isLoggedIn && <Button>Log Out</Button>) ||
                    <HStack>
                        <Button onClick={onOpenSignIn}>Sign In</Button>
                        <Button onClick={onOpenSignUp}>Sign Up</Button>
                    </HStack>
                }
            </GridItem>
        </Grid>

        <SignInModal isOpen={isOpenSignIn} onClose={onCloseSignIn}/>

        <SignUpModal isOpen={isOpenSignUp} onClose={onCloseSignUp}/>
    </>);
}