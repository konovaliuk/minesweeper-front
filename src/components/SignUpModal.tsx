import {
    Button,
    FormControl,
    FormErrorMessage,
    FormHelperText,
    FormLabel,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useToast
} from "@chakra-ui/react";
import { useState } from "react";
import { testEmail } from "../util/general";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { sendRegister } from "../util/requests";
import RegistrationDto from "../types/dto/RegistrationDto";

type Props = {
    isOpen: boolean
    onClose: () => void
}

export default function SignUpModal({ isOpen, onClose }: Props) {
    const toast = useToast({ isClosable: true });

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const invalidEmail = !testEmail(email);

    const onClickSignUp = () => {
        if (!(username.length >= 5 && !invalidEmail && password.length >= 6 && passwordRepeat === password)) return;

        sendRegister(new RegistrationDto(username, email, password)).then(
            response => {
                console.log(response);
                if (response.status === 201) {
                    onClose();
                    toast({
                        status: "success",
                        title: "Successfully registered!"
                    });
                } else response.json().then((json) => toast({
                    status: "error",
                    title: json.message
                }));
            },
            reason => {
                console.log(reason);
                toast({
                    status: "error",
                    title: "Something went wrong"
                })
            }
        );
    };

    return (
        <Modal id="signUpModal" isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Create your account</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <FormControl isInvalid={
                        (username !== "" && username.length < 5) ||
                        (email !== "" && invalidEmail) ||
                        (password !== "" && password.length < 6) ||
                        (password !== "" && passwordRepeat !== password)
                    }>
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <Input
                            id="username" type="text"
                            value={username} placeholder="Username"
                            onChange={e => setUsername(e.target.value)}
                        />
                        {
                            username !== "" && username.length < 5
                                ? <FormErrorMessage>Username is too short</FormErrorMessage>
                                : ""
                        }

                        <FormLabel mt={3} htmlFor="email">Email</FormLabel>
                        <Input
                            id="email" type="email"
                            value={email} placeholder="Email"
                            onChange={e => setEmail(e.target.value)}
                        />
                        {
                            email !== "" && invalidEmail
                                ? <FormErrorMessage>Invalid email</FormErrorMessage>
                                : ""
                        }

                        <FormLabel mt={3} htmlFor="passwordUp">Password</FormLabel>
                        <InputGroup id="passwordUp">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password} placeholder="Password"
                                onChange={e => setPassword(e.target.value)}
                            />
                            <InputRightElement>
                                <IconButton
                                    aria-label={showPassword ? "hide password" : "show password"}
                                    icon={showPassword ? <ViewIcon/> : <ViewOffIcon/>}
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </InputRightElement>
                        </InputGroup>
                        {
                            password !== "" && password.length < 6
                                ? <FormErrorMessage>Password must be at least 6 long</FormErrorMessage>
                                : <FormHelperText>Create new password</FormHelperText>
                        }

                        <FormLabel mt={3} htmlFor="passwordRepeat">Repeat password</FormLabel>
                        <InputGroup id="passwordRepeat">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={passwordRepeat} placeholder="Repeat password"
                                onChange={e => setPasswordRepeat(e.target.value)}
                            />
                            <InputRightElement>
                                <IconButton
                                    aria-label={showPassword ? "hide password" : "show password"}
                                    icon={showPassword ? <ViewIcon/> : <ViewOffIcon/>}
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </InputRightElement>
                        </InputGroup>
                        {
                            password !== "" && passwordRepeat !== password
                                ? <FormErrorMessage>Passwords does not match</FormErrorMessage>
                                : <FormHelperText>Repeat your password</FormHelperText>
                        }
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <HStack spacing={6}>
                        <Button onClick={onClickSignUp} colorScheme="blue">Sign Up</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}