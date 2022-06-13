export type LogInVariant = "email" | "username";

export default class LogInDto {
    readonly variant: LogInVariant
    readonly login: string
    readonly password: string

    constructor(variant: LogInVariant, login: string, password: string) {
        this.variant = variant;
        this.login = login;
        this.password = password;
    }
}