import {
    Button,
    Checkbox,
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
import useCookie from "react-use-cookie";
import LogInDto from "../types/dto/LogInDto";
import { fetchUsername, refreshLogin, sendLogin } from "../util/requests";

type Props = {
    isOpen: boolean
    onClose: () => void
}

export default function SignInModal({ isOpen, onClose }: Props) {

    const [variant, setVariant] = useState<"Email" | "Username">("Email");
    const [value, setValue] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [stayLogged, setStayLogged] = useState(false);

    const invalidEmail: boolean = !testEmail(value);
    const invalidUsername: boolean = value.trim().length < 3;

    const [, setStayLoggedCookie] = useCookie("stayLogged");
    const [, setAccessToken] = useCookie("accessToken");
    const [, setRefreshToken] = useCookie("refreshToken");
    const [, setUsername] = useCookie("username");

    const onClickLogIn = () => {
        if (invalidEmail || invalidUsername) return;
        const dto: LogInDto = {
            variant: variant === "Email" ? "email" : "username",
            login: value.trim(),
            password: password.trim()
        };
        sendLogin(dto).then(
            ({ at, rt }) => {
                setAccessToken(
                    JSON.stringify(at),
                    {
                        days: 1,
                        Secure: true
                    }
                );
                fetchUsername(at).then((username) => {
                    username
                        ? setUsername(username)
                        : (stayLogged && refreshLogin(rt).then(({ at, rt }) => {
                            setAccessToken(
                                JSON.stringify(at),
                                {
                                    days: 1,
                                    Secure: true
                                }
                            );
                            setRefreshToken(
                                JSON.stringify(rt),
                                {
                                    days: 7,
                                    Secure: true
                                }
                            );
                        }));
                });
                setStayLoggedCookie(String(stayLogged));
                if (stayLogged) setRefreshToken(
                    JSON.stringify(rt),
                    {
                        days: 7,
                        Secure: true
                    }
                );
            }
        );
    };

    return (
        <Modal id="signInModal" isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Log into your account</ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <FormControl
                        isInvalid={value !== "" && ((variant === "Email" && invalidEmail) || (variant === "Username" && invalidUsername))}
                    >
                        <FormLabel htmlFor="variant">Variant:</FormLabel>
                        <RadioGroup
                            id="variant" value={variant}
                            onChange={v => {
                                // @ts-ignore
                                setVariant(v);
                            }}
                        >
                            <HStack>
                                <Radio value="Email">Email</Radio>
                                <Radio value="Username">Username</Radio>
                            </HStack>
                        </RadioGroup>

                        <FormLabel htmlFor="usr_eml" mt={3}>{variant}</FormLabel>
                        <Input
                            id="usr_eml"
                            type={variant === "Email" ? "email" : "text"}
                            placeholder={variant}
                            value={value}
                            onChange={e => setValue(e.target.value)}
                        />
                        {
                            (variant === "Email" && invalidEmail) || (variant === "Username" && invalidUsername)
                                ? <FormErrorMessage>Invalid {variant}</FormErrorMessage>
                                : <FormHelperText>Enter your {variant}</FormHelperText>
                        }

                        <FormLabel htmlFor="password" mt={3}>Password</FormLabel>
                        <InputGroup id="password">
                            <Input
                                type={showPassword ? "text" : "password"} value={password}
                                placeholder="Password"
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
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <HStack spacing={6}>
                        <Checkbox isChecked={stayLogged} onChange={e => setStayLogged(e.target.checked)}>Say
                            logged</Checkbox>
                        <Button onClick={onClickLogIn} colorScheme="blue">Log in</Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </HStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}