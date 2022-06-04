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
    Radio,
    RadioGroup
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useState } from "react";
import { testEmail } from "../util/general";

type Props = {
    isOpen: boolean
    onClose: () => void
}

export default function SignInModal({ isOpen, onClose }: Props) {

    const [signInVariant, setSignInVariant] = useState<"Email" | "Username">("Email");
    const [signInValue, setSignInValue] = useState("");
    const [signInPassword, setSignInPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const invalidEmail = !testEmail(signInValue);

    const onClickLogIn = () => {

    }

    return (
        <Modal id="signInModal" isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Log into your account</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <FormControl isInvalid={signInValue !== "" && (signInVariant === "Email" && invalidEmail)}>
                        <FormLabel htmlFor="variant">Variant:</FormLabel>
                        <RadioGroup
                            id="variant" value={signInVariant}
                            onChange={v => {
                                // @ts-ignore
                                setSignInVariant(v);
                            }}
                        >
                            <HStack>
                                <Radio value="Email">Email</Radio>
                                <Radio value="Username">Username</Radio>
                            </HStack>
                        </RadioGroup>

                        <FormLabel htmlFor="usr_eml">Username/Email</FormLabel>
                        <Input
                            id="usr_eml"
                            type={signInVariant === "Email" ? "email" : "text"}
                            placeholder={signInVariant}
                            value={signInValue}
                            onChange={e => setSignInValue(e.target.value)}
                        />
                        {
                            signInVariant === "Email" && invalidEmail
                                ? <FormErrorMessage>Invalid email</FormErrorMessage>
                                : <FormHelperText/>
                        }

                        <FormLabel htmlFor="password">Password</FormLabel>
                        <InputGroup id="password">
                            <Input
                                type={showPassword ? "text" : "password"} value={signInPassword}
                                placeholder="Password"
                                onChange={e => setSignInPassword(e.target.value)}
                            />
                            <InputRightElement>
                                <IconButton
                                    aria-label={showPassword ? "hide password" : "show password"}
                                    icon={showPassword ? <ViewIcon/> : <ViewOffIcon/>}
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            </InputRightElement>
                        </InputGroup>
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <HStack spacing={6}>
                        <Button onClick={onClickLogIn} colorScheme="blue">Log in</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}