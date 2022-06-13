import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure
} from "@chakra-ui/react";
import useCookie from "react-use-cookie";

export default function ProfileButton() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [username, ] = useCookie("username");

    return (<>
        <Button onClick={onOpen}>Profile</Button>

        <Modal id="profileModal" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>{username}'s profile</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    
                </ModalBody>
            </ModalContent>
        </Modal>
    </>);
}