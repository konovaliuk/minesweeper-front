import {
    Button,
    HStack,
    IconButton,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
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
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { fetchRatingPage, fetchTotalUsers } from "../util/requests";
import constants from "../configs/constants.json"

export type RatingRecord = {
    username: string
    wins: number
    losses: number
    totalPoints: number
}

export default function Leaderboard() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [page, setPage] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [pageContents, setPageContents] = useState<RatingRecord[]>([])

    useEffect(() => {
        document.addEventListener("game saved", () => {
            fetchTotalUsers().then((total) => setTotalUsers(total));
            fetchRatingPage(page).then((pageContents) => setPageContents(pageContents));
        })
        fetchTotalUsers().then((total) => setTotalUsers(total));
        fetchRatingPage(page).then((pageContents) => setPageContents(pageContents));
    }, []);

    const prevPage = () => {
        fetchTotalUsers().then((total) => setTotalUsers(total));
        if (page > 0) setPage(page - 1);
        fetchRatingPage(page).then((pageContents) => setPageContents(pageContents));
    };

    const nextPage = () => {
        fetchTotalUsers().then((total) => setTotalUsers(total));
        if (page < Math.ceil(totalUsers / constants.RATING_PAGE_SIZE)) setPage(totalUsers + 1);
        fetchRatingPage(page).then((pageContents) => setPageContents(pageContents));
    }

    return (<>
        <Button _focus={{}} onClick={onOpen}>Leaderboard</Button>

        <Modal isOpen={isOpen} onClose={onClose} scrollBehavior="outside" size="xl">
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Leaderboard</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <TableContainer>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>Username</Th>
                                    <Th>Wins</Th>
                                    <Th>Losses</Th>
                                    <Th>Total points</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {pageContents.map((row, i) =>
                                    (<Tr key={`rating_row_${i}`}>
                                        <Td>{row.username}</Td>
                                        <Td isNumeric>{row.wins}</Td>
                                        <Td isNumeric>{row.losses}</Td>
                                        <Td isNumeric>{row.totalPoints}</Td>
                                    </Tr>))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </ModalBody>
                <ModalFooter>
                    <HStack>
                        <IconButton icon={<ArrowBackIcon/>} aria-label="previous" onClick={prevPage}/>
                        <IconButton icon={<ArrowForwardIcon/>} aria-label="next" onClick={nextPage}/>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </>);
}