import apiClient from "./api-client";
import { getAuthHeaders,setAuthHeaders, setPermissions, setTtl } from "../public/data";
import { IInstractor } from "../public/interfaces";
import { data } from "jquery";
import { set } from "react-hook-form";


const getTTLFromExpires = (expires: string): number => {
    // Extract the date string from the expires string
    const dateString = expires.split('=')[1];
    // Parse the date string to a Date object
    const expirationDate = new Date(dateString);
    // Get the current date
    const currentDate = new Date();
    // Calculate the difference in milliseconds
    const diffInMs = expirationDate.getTime() - currentDate.getTime();
    // Convert milliseconds to seconds
    const ttlInSeconds = Math.floor(diffInMs / 1000);
    return ttlInSeconds;
}    

export const deleteAllCookies= () => {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}
export const parseCookieToHeaders = (cookieString: string) => {
    console.log('parseCookieToHeaders cookieString:', cookieString);
    if (!cookieString || cookieString === '') {
        return {};
    }
    
    const cookieParts = cookieString.split(';');
    const headers: { [key: string]: string } = {};
    cookieParts.forEach(part => {
        const [key, value] = part.split('=');
        if (key && value&& key.trim()=== 'path') {
            //the value start with "/" and i want to remove it
            headers[key.trim()] = value.trim().substring(1);
        }else if (key && value&& key.trim()=== 'expires') {
            headers[key.trim()] = getTTLFromExpires(value.trim()).toString();
        }else{
            headers[key.trim()] = value.trim();
        }
    });
    return headers;
}

// // Function to send the parsed cookie as headers
// const sendCookieToServer = async (instructorId: string, otp: string) => {
//     try {
//         if (instructorId) {
//             const cookieString = document.cookie;
//             const headers = parseCookieToHeaders(cookieString);
//             const res = await apiClient.post('/auth/verify',
//                 { clientId: instructorId, otpUser: otp },
//                 {
//                     headers: headers
//                 }
//             );
//             console.log('Response:', res.data);
//         }
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }


export const sentOtp = async (clientId: string) => {
    try {
       
        const response = await apiClient.post('/auth/sent-otp', { clientId });
        return response.data;
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
}


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

export const getCookieByidInstractor = (idInstractor: string) => {
    const id = `idInstractor=${idInstractor}`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    const cookies = [];

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.includes(id)) {
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

export const setNewCookie = (instructorName: string, idInstractor: string, value: string, hours: number) => {
    deleteAllCookies();
    console.log('setNewCookie:', instructorName, idInstractor, value, hours);
    const prevCookie = getCookieByidInstractor(idInstractor);
    console.log('setNewCookie prevCookie:', prevCookie);

    const newDate = new Date();
    console.log('setNewCookie, newDate (local):', newDate);

    newDate.setTime(newDate.getTime() + hours * 60 * 60 * 1000);
    console.log('setNewCookie, newDate after adding hours (local):', newDate);

    const expiresUTC = `expires=${newDate.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' })}`;
    console.log('setNewCookie, newExpires (UTC):', expiresUTC);

    const expiresLocal = newDate.toLocaleString('en-US', { timeZone: 'Asia/Jerusalem' });
    console.log('setNewCookie, newExpires (local):', expiresLocal);

    // Check and handle existing cookies
    if (prevCookie.length === 1) {
        console.log('setNewCookie, prevCookie.length === 1');
        const existingCookie = prevCookie[0];
        const existingExpires = new Date(existingCookie.split('expires=')[1].split(';')[0]).getTime();
        console.log('setNewCookie, existingExpires:', existingExpires);

        if (newDate.getTime() > existingExpires) {
            console.log('setNewCookie, newExpires > existingExpires');
            const path = `path=/${idInstractor}`;
            console.log('setNewCookie, setting new cookie:', instructorName, value, expiresUTC, path);
            document.cookie = `${instructorName}=${value}; ${expiresUTC}; ${path}`;
            console.log('setNewCookie, document.cookie:', document.cookie);
            return document.cookie;
        } else {
            console.log('setNewCookie, newExpires <= existingExpires');
            return existingCookie;
        }
    } else if (prevCookie.length > 1) {
        console.log('setNewCookie, prevCookie.length > 1');
        deleteAllCookiesById(prevCookie);
    }

    // Setting new cookie
    const path = `path=/${idInstractor}`;
    console.log('setNewCookie, setting new cookie:', instructorName, value, expiresUTC, path);
    document.cookie = `${instructorName}=${value}; ${expiresUTC}; ${path}`;
    console.log('setNewCookie, document.cookie:', document.cookie);
    return document.cookie;
}


export const getAllCookies = () => {
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    const cookies = [];
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        cookies.push(c);
    }
    return cookies;
}

export const verifyNewOtp = async (instructor: IInstractor, permissionAskingFromClient: string, otp: string, hours: number) => {
    console.log('verifyNewOtp:', instructor, otp, hours, permissionAskingFromClient);
    let res;
    if (instructor._id) {
        const prevCookies = getCookiesByPath(instructor._id);
        if (prevCookies.length> 1) {
            deleteAllCookiesById(prevCookies);
        }
        const headers = parseCookieToHeaders(prevCookies[0] || '');
        console.log('headers:', headers);
        console.log('clientId:instructor._id, otpUser: otp, permissionFromreq:permissionAskingFromClient, seconds: hours * 60 * 60', instructor._id, otp, permissionAskingFromClient, hours * 60 * 60);
        try{
            res = await apiClient.post('/auth/verifyNewOtp',
                    { clientId:instructor._id, otpUser: otp, permissionFromreq:permissionAskingFromClient, seconds: hours * 60 * 60 },
                    { headers: headers });
            console.log("res.status:", res.status);
            if (res && res.status ===200 && res.data.permissions) {
                const docCookie = setNewCookie(instructor.name, instructor._id, otp, hours, res.data.permissions);
                setAuthHeaders(instructor._id, otp);
                setPermissions(res.data.permissions);
                console.log('docCookie:', docCookie);
                console.log('res.data:', res.data);
                if (docCookie){
                    return {cookie : docCookie, res: res.data}; 
                }
            }
        }catch (error) {
            console.error('Error verifying OTP:', error);
            if (instructor._id) {
                const cookies = getCookiesByPath(instructor._id);
                deleteAllCookiesById(cookies);
            }
        }
    }
}

export const verifyOtpOnCookies = async (instructor: IInstractor, otp: string) => {
    console.log('verifyOtp:', instructor, otp);
    if (!instructor._id) {
        try {
            const response = await apiClient.post('/auth/verifyOtp', { clientId:instructor._id, otpUser: otp });
            console.log("response.status:", response.status);
            console.log("response.data:", response.data);
            if (response.status === 200) {
                setPermissions(response.data.permissions);
                setAuthHeaders(instructor._id!, otp);
                setTtl(response.data.ttl);
            }
            return response.data;
        } catch (error) {
            console.error('Error verifying OTP:', error);
}
    }
}
