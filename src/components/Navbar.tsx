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
    useDisclosure
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import { invalidateAccess } from "../util/requests";
import useCookie from "react-use-cookie";
import ProfileButton from "./ProfileButton";

type Props = {
    isLoggedIn: boolean
    settingsChild: any
}

export default function Navbar({ isLoggedIn, settingsChild }: Props) {

    const { isOpen: isOpenSignIn, onOpen: onOpenSignIn, onClose: onCloseSignIn } = useDisclosure();
    const { isOpen: isOpenSignUp, onOpen: onOpenSignUp, onClose: onCloseSignUp } = useDisclosure();
    const { isOpen: isOpenSettings, onOpen: onOpenSettings, onClose: onCloseSettings } = useDisclosure();
    const [refreshToken,] = useCookie("refreshToken");

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
                    <Button _focus={{}} onClick={onOpenSettings}>
                        Settings
                    </Button>
                </HStack>
            </GridItem>
            <GridItem>
                <Heading>MINESWEEPER</Heading>
            </GridItem>
            <GridItem>
                {isLoggedIn
                    ? <HStack>
                        <ProfileButton/>
                        <Button onClick={() => invalidateAccess(JSON.parse(refreshToken))}>Log Out</Button>
                    </HStack>
                    : <HStack>
                        <Button onClick={onOpenSignIn}>Sign In</Button>
                        <Button onClick={onOpenSignUp}>Sign Up</Button>
                    </HStack>}
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

        <SignInModal isOpen={isOpenSignIn} onClose={onCloseSignIn}/>

        <SignUpModal isOpen={isOpenSignUp} onClose={onCloseSignUp}/>
    </>);
}