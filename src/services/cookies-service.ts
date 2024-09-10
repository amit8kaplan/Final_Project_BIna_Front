import apiClient from "./api-client";
import { getAuthHeaders } from "./auth-service";
import { getPermissions } from "./permissions-service";
import { verifyRegular } from "./regular-service";


export const getCookiesByPath = (idInstractor: string) => {
    const path = `/${idInstractor}`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    const cookies = [];
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.includes(`path=${path}`)) {
            cookies.push(c);
        }
    }
    return cookies;
}

export const deleteAllCookiesById = (cookies: string[]) => {
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const name = cookie.split('=')[0];
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    }
}

export const setNewCookie = (instructorName: string, idInstractor: string, value:string, hours: number) => {
    const prevCookie = getCookiesByPath(idInstractor);
    if (prevCookie.length == 1) {
        return prevCookie;
    }
    else if (prevCookie.length > 1) {
        deleteAllCookiesById(prevCookie);
    }
    else{
        const date = new Date();
        date.setTime(date.getTime() + hours * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;
        const path = `path=/${idInstractor}`;
        document.cookie = `${instructorName}=${value};${expires};${path}`;
    }
}

