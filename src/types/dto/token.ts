export default interface Token {
    iss: string
    iat: number
    exp: number
    sub: string
}

export class AccessToken implements Token {
    constructor(issuer: string, issuedAt: number, expiration: number, subject: string) {
        this.iss = issuer;
        this.iat = issuedAt;
        this.exp = expiration;
        this.sub = subject;
    }

    exp: number;
    iat: number; // 3600000 = one hour
    iss: string;
    sub: string;
}

export class RefreshToken implements Token {
    constructor(issuer: string, issuedAt: number, expiration: number, subject: string) {
        this.iss = issuer;
        this.iat = issuedAt;
        this.exp = expiration;
        this.sub = subject;
    }

    iss: string
    iat: number
    exp: number // 604800000 = one week
    sub: string
}