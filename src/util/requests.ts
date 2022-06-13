import RegistrationDto from "../types/dto/RegistrationDto";
import LogInDto from "../types/dto/LogInDto";
import endpoints from "../configs/endpoints.json";
import { KJUR } from "jsrsasign";
import { AccessToken, RefreshToken } from "../types/dto/token";

export async function sendRegister(regDto: RegistrationDto): Promise<Response> {
    const oHeader = { alg: 'HS256', typ: 'JWT' };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(regDto);
    const sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, process.env.REACT_APP_JWT_SECRET)

    return await fetch(endpoints.HOST + endpoints.REGISTRATION, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: sJWT
    });
}

export async function sendLogin(loginDto: LogInDto): Promise<{ at: AccessToken, rt: RefreshToken }> {
    const oHeader = { alg: 'HS256', typ: 'JWT' };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(loginDto);
    const sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, process.env.REACT_APP_JWT_SECRET)

    return await fetch(endpoints.HOST + endpoints.LOGIN, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: sJWT
    }).then(
        (response) => response.json(),
        (reason) => console.log({ reason })
    );
}

export async function validateLogin(accessToken: AccessToken): Promise<boolean> {
    const oHeader = { alg: 'HS256', typ: 'JWT' };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(accessToken);
    const sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, process.env.REACT_APP_JWT_SECRET)

    return await fetch(endpoints.HOST + endpoints.VALIDATE_LOGIN, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        body: sJWT
    }).then(
        (response) => response.json(),
        (reason) => console.log({ reason })
    );
}

export async function refreshLogin(refreshToken: RefreshToken): Promise<{ at?: AccessToken, rt?: RefreshToken }> {
    const oHeader = { alg: 'HS256', typ: 'JWT' };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(refreshToken);
    const sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, process.env.REACT_APP_JWT_SECRET)

    return await fetch(endpoints.HOST + endpoints.REFRESH_LOGIN, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: sJWT
    }).then(
        (response) => response.json(),
        (reason) => console.log({ reason })
    );
}

export async function invalidateAccess(refreshToken: RefreshToken): Promise<void> {
    const oHeader = { alg: 'HS256', typ: 'JWT' };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(refreshToken);
    const sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, process.env.REACT_APP_JWT_SECRET)

    return await fetch(endpoints.HOST + endpoints.INVALIDATE_ACCESS, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: sJWT
    }).then();
}

export async function fetchUsername(accessToken: AccessToken): Promise<string | undefined> {
    const oHeader = { alg: 'HS256', typ: 'JWT' };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(accessToken);
    const sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, process.env.REACT_APP_JWT_SECRET)

    return await fetch(endpoints.HOST + endpoints.FETCH_USERNAME, {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
        body: sJWT
    }).then((response) => response.json());
}