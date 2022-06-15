import RegistrationDto from "../types/dto/RegistrationDto";
import LogInDto from "../types/dto/LogInDto";
import endpoints from "../configs/endpoints.json";
import constants from "../configs/constants.json";
import { KJUR } from "jsrsasign";
import { RatingRecord } from "../components/Leaderboard";
import { setCookie } from "react-use-cookie";
import CellDto from "../types/dto/CellDto";

export async function sendRegister(regDto: RegistrationDto): Promise<Response> {
    const oHeader = { alg: "HS256", typ: "JWT" };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(regDto);
    const sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, process.env.REACT_APP_JWT_SECRET)

    return await fetch(endpoints.HOST + endpoints.REGISTRATION, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: sJWT
    });
}

export async function sendLogin(loginDto: LogInDto): Promise<{ at: string, rt: string }> {
    const oHeader = { alg: "HS256", typ: "JWT" };
    const sHeader = JSON.stringify(oHeader);
    const sPayload = JSON.stringify(loginDto);
    const sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, process.env.REACT_APP_JWT_SECRET)

    return await fetch(endpoints.HOST + endpoints.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: sJWT
    }).then(
        async (response) => {
            const res = await response.json();
            console.log(res);
            return res;
        }
    );
}

export async function validateLogin(accessToken: string): Promise<boolean> {
    return await fetch(`${endpoints.HOST}${endpoints.VALIDATE_LOGIN}?at=${accessToken}`, {
        method: "GET"
    }).then(
        async (response) => await response.json()
    );
}

export async function refreshLogin(refreshToken: string): Promise<{ at?: string, rt?: string }> {
    return await fetch(endpoints.HOST + endpoints.REFRESH_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: refreshToken
    }).then(
        async (response) => {
            const res = await response.json();
            console.log(res);
            return res
        }
    );
}

export async function invalidateAccess(accessToken: string): Promise<void> {
    return await fetch(endpoints.HOST + endpoints.INVALIDATE_ACCESS, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: accessToken
    }).then((_resp) => {
        setCookie("accessToken", "");
        setCookie("refreshToken", "");
    });
}

export async function fetchUsername(accessToken: string): Promise<string | undefined> {
    return await fetch(endpoints.HOST + endpoints.FETCH_USERNAME + `?at=${accessToken}`, {
        method: "GET"
    }).then((response) => response.text());
}

export async function fetchTotalUsers(): Promise<number> {
    return await fetch(endpoints.HOST + endpoints.TOTAL_USERS, {
        method: "GET"
    }).then((response) => Number(response.json()));
}

export async function fetchRatingPage(page: number): Promise<RatingRecord[]> {
    return await fetch(endpoints.HOST + endpoints.RATING_PAGE + `?page=${page}&pageSize=${constants.RATING_PAGE_SIZE}`, {
        method: "GET"
    }).then((response) => response.json());
}

export async function fetchUserRating(username: string): Promise<RatingRecord> {
    return await fetch(endpoints.HOST + endpoints.USER_RATING + `?username=${username}`, {
        method: "GET"
    }).then(async (response) => await response.json());
}

export async function sendGameResult(accessToken: string,
                                     game: {
                                         gameState: "WON" | "LOST",
                                         cells: CellDto[][],
                                         width: number,
                                         height: number
                                     }): Promise<Response> {
    return await fetch(endpoints.HOST + endpoints.SAVE_GAME, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, game })
    });
}