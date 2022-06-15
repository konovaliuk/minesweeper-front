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
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Skeleton,
    useDisclosure
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import { invalidateAccess } from "../util/requests";
import ProfileButton from "./ProfileButton";
import Leaderboard from "./Leaderboard";
import { updateItem } from "react-use-cookie";

type Props = {
    isLoggedIn?: boolean
    setLoggedIn: (loggedIn: boolean) => void
    settingsChild: any
    accessToken: string
    setAccessToken: updateItem
    setRefreshToken: updateItem
}

export default function Navbar({ isLoggedIn, setLoggedIn, settingsChild, accessToken, setAccessToken, setRefreshToken }: Props) {

    const { isOpen: isOpenSignIn, onOpen: onOpenSignIn, onClose: onCloseSignIn } = useDisclosure();
    const { isOpen: isOpenSignUp, onOpen: onOpenSignUp, onClose: onCloseSignUp } = useDisclosure();
    const { isOpen: isOpenSettings, onOpen: onOpenSettings, onClose: onCloseSettings } = useDisclosure();

    const onLogout = () => invalidateAccess(accessToken).then(() => setLoggedIn(false))

    return (<>
        <Grid templateColumns='repeat(3, 1fr)' gap="10vw">
            <GridItem>
                <HStack>
                    <Menu>
                        <MenuButton _focus={{}} as={Button} rightIcon={<ChevronDownIcon/>}>
                            Controls
                        </MenuButton>
                        <MenuList>
                            <MenuItem _active={{}} _focus={{}}>
                                Discover Cell: <Kbd ml={5}>Left Click</Kbd>
                            </MenuItem>
                            <MenuItem _active={{}} _focus={{}}>
                                Flag Cell: <Kbd ml={5}>Shift</Kbd> + <Kbd>Left Click</Kbd>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                    <Button _focus={{}} onClick={onOpenSettings}>
                        Settings
                    </Button>
                </HStack>
            </GridItem>
            <GridItem>
                <Heading>MINESWEEPER</Heading>
            </GridItem>
            <GridItem>
                <Skeleton isLoaded={isLoggedIn !== undefined}>
                    {isLoggedIn
                        ? <HStack>
                            <Leaderboard/>
                            <ProfileButton/>
                            <Button _focus={{}} onClick={onLogout}>Log Out</Button>
                        </HStack>
                        : <HStack>
                            <Leaderboard/>
                            <Button _focus={{}} onClick={onOpenSignIn}>Sign In</Button>
                            <Button _focus={{}} onClick={onOpenSignUp}>Sign Up</Button>
                        </HStack>}
                </Skeleton>
            </GridItem>
        </Grid>

        <Modal id="settingsModal" isOpen={isOpenSettings} onClose={onCloseSettings}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Game Settings</ModalHeader>
                <ModalCloseButton/>
                <ModalBody pb={4}>
                    {settingsChild}
                </ModalBody>
            </ModalContent>
        </Modal>

        <SignInModal
            isOpen={isOpenSignIn} onClose={onCloseSignIn} setLoggedIn={setLoggedIn}
            setAccessToken={setAccessToken} setRefreshToken={setRefreshToken}
        />

        <SignUpModal isOpen={isOpenSignUp} onClose={onCloseSignUp}/>
    </>);
}