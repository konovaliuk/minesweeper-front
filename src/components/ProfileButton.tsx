import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    useDisclosure
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useCookie from "react-use-cookie";
import { RatingRecord } from "./Leaderboard";
import { fetchUserRating } from "../util/requests";

export default function ProfileButton() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [username,] = useCookie("username");

    const [rating, setRating] = useState<RatingRecord>();

    useEffect(() => {
        document.addEventListener("game saved", () => {
            fetchUserRating(username).then((ratingRecord) => setRating(ratingRecord));
        });
        fetchUserRating(username).then((ratingRecord) => setRating(ratingRecord));
    }, []);

    return (<>
        <Button _focus={{}} onClick={onOpen}>Profile</Button>

        <Modal id="profileModal" isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>{username}'s profile</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <TableContainer>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Wins</Th>
                                    <Th>Losses</Th>
                                    <Th>Total points</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td isNumeric>{rating?.wins || 0}</Td>
                                    <Td isNumeric>{rating?.losses || 0}</Td>
                                    <Td isNumeric>{rating?.totalPoints || 0}</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                </ModalBody>
            </ModalContent>
        </Modal>
    </>);
}