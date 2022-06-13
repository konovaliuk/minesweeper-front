export default class RegistrationDto {
    readonly username: string
    readonly email: string
    readonly password: string

    constructor(username: string, email: string, password: string) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}