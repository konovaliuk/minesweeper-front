export default interface Token {
    iat: number
    exp: number
    sub: string
}

export class AccessToken implements Token {
    constructor(issuedAt: number, expiration: number, subject: string) {
        this.iat = issuedAt;
        this.exp = expiration;
        this.sub = subject;
    }

    exp: number;
    iat: number; // 3600000 = one hour
    sub: string;
}

export class RefreshToken implements Token {
    constructor(issuedAt: number, expiration: number, subject: string) {
        this.iat = issuedAt;
        this.exp = expiration;
        this.sub = subject;
    }

    iat: number
    exp: number // 604800000 = one week
    sub: string
}