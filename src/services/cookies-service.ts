import apiClient from "./api-client";
import { deleteAllHeaders,getAuthHeaders,setAuthHeaders, setPermissions, setTtl } from "../public/data";
import { ICookie, IInstractor } from "../public/interfaces";
import { data, get } from "jquery";
import { set } from "react-hook-form";
import useSessionStorage from "../hooks/useSessionStorage";
// import Cookies from 'js-cookie';


const splitValue = (value: string): string[] => {
    return value.split('_');
}
export const getTTLFromExpires = (expires: string): number => {
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
    //console.log('parseCookieToHeaders cookieString:', cookieString);
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

export const getCookieByIdINValue = (idInstractor: string) => {
    // The value is the idInstractor + "_" + otp
    // We want to check if the value is in the cookies based on the idInstractor only
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    //console.log('getCookieByIdINValue ca:', ca);
    const cookies = [];
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.includes(idInstractor + "_")) {
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
// document.cookie = `${instructor.name}=${Value}; Expires=${new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()}; Path=/`;
export const setNewCookie = (instructorName: string, idInstractor: string, value: string, hours: number, permissions: string) => {
    //console.log('setNewCookie:', instructorName, idInstractor, value, hours);

    const newDate = new Date();
    const newExpires = new Date(newDate.getTime() + hours * 60 * 60 * 1000);
    const maxAge = hours * 60 * 60;
    
    const maxAgeString = `Max-Age=${hours * 60 * 60}`;
    //console.log('setNewCookie, maxAge, maxAgeString:', maxAge, maxAgeString);
    //console.log('setNewCookie, newDate (local):', newDate);
    const val = idInstractor + '_' + permissions + '_' +newExpires.toUTCString();
    const prevCookie = getCookieByIdINValue(instructorName);
    //console.log('setNewCookie prevCookie:', prevCookie);
    // Check and handle existing cookies
    if (prevCookie.length === 1) {
        //console.log('setNewCookie, prevCookie.length === 1');
        const existingCookie = prevCookie[0];
        const existingExpiresString = existingCookie.split('_')[2];
        if (existingExpiresString) {
            const existingExpiresDate = new Date(existingExpiresString);
            const currentTime = new Date();
            const existingTTL = Math.floor((existingExpiresDate.getTime() - currentTime.getTime()) / 1000);
            //console.log('setNewCookie, existingTTL:', existingTTL);

            if (maxAge> existingTTL) {
                deleteAllCookiesById(prevCookie);
            } else {
                //console.log('setNewCookie, newExpires <= existingExpires');
                return existingCookie;
            }
        }
    } else if (prevCookie.length > 1) {
        //console.log('setNewCookie, prevCookie.length > 1');
        deleteAllCookiesById(prevCookie);
    }

    // Setting new cookie
    const path = `path=/`;
    //console.log('setNewCookie, setting new cookie:', instructorName, value, maxAgeString, path);
    document.cookie = `${instructorName}=${val}; ${maxAgeString}; ${path}`;
    //console.log('setNewCookie, document.cookie:', document.cookie);
    return document.cookie;
}

export const getAllCookies = (): ICookie[] => {
    //console.log('document.cookie:', document.cookie);
    const decodedCookie = decodeURIComponent(document.cookie);
    //console.log('decodedCookie:', decodedCookie);
    const ca = decodedCookie.split(';'); // Split by semicolon
    const cookies: ICookie[] = [];
    const now = new Date();

    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c) {
            const [nameValue, expires] = c.split(/(?<=_)(?=Fri|Sat|Sun|Mon|Tue|Wed|Thu)/); // Split by the start of the date string
            const [name, value] = nameValue.split('=');
            const [idInstractor, permmistion] = value.split('_');
            const expirationDate = new Date(expires.trim());
            const ttl = Math.max(0, Math.floor((expirationDate.getTime() - now.getTime()) / 1000)); // Calculate TTL in seconds

            cookies.push({
                name: name.trim(),
                idInstractor: idInstractor.trim(),
                permmistion: permmistion.trim(),
                date: expires.trim(),
                ttl: ttl
            });
        }
    }
    return cookies;
}

export const addMoreTimeToCookie = async (instructorName: string, idInstractor:string, otp: string, hours: number) => {
    //console.log('addMoreTimeToCookie:', instructorName, idInstractor, otp, hours);
    if (idInstractor) {
        const prevCookies = getCookieByIdINValue(idInstractor);
        if (prevCookies.length >1) {
            deleteAllCookiesById(prevCookies);
        }
        const headers = getAuthHeaders()

        if (prevCookies.length === 1) {
            try{
                const res = await apiClient.post('/auth/newTtlSession',
                     { seconds: hours * 60 * 60} ,{
                        headers: headers,
                    });
                //console.log("res.status:", res.status);
                const docCookie = setNewCookie(instructorName, idInstractor, otp, hours, res.data.permissions);
                    return {cookie : document.cookie, res: res.data};
            }catch (error) {
                console.error('Error adding more time:', error);
            }
        }
    }
    return {message: "Instructor not found"};

}
export const verifyNewOtp = async (instructor: IInstractor, permissionAskingFromClient: string, otp: string, hours: number) => {
    //console.log('verifyNewOtp:', instructor, otp, hours, permissionAskingFromClient);
    let res;
    if (instructor._id) {
        const prevCookies = getCookieByIdINValue(instructor._id);
        if (prevCookies.length> 1) {
            deleteAllCookiesById(prevCookies);
        }
        const headers = parseCookieToHeaders(prevCookies[0] || '');
        //console.log('headers:', headers);
        //console.log('clientId:instructor._id, otpUser: otp, permissionFromreq:permissionAskingFromClient, seconds: hours * 60 * 60', instructor._id, otp, permissionAskingFromClient, hours * 60 * 60);
        try{
            res = await apiClient.post('/auth/verifyNewOtp',
                    { clientId:instructor._id, otpUser: otp, permissionFromreq:permissionAskingFromClient, seconds: hours * 60 * 60 },
                    { headers: headers });
            //console.log("res.status:", res.status);
            //console.log("res:", res);
            if (res && res.status ===200 && res.data.permissions) {
                // document.cookie = `${instructor.name}=${Value}; Expires=${new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString()}; Path=/`;
                const docCookie = setNewCookie(instructor.name, instructor._id, otp, hours, res.data.permissions);
                setAuthHeaders(instructor._id, otp);
                setPermissions(res.data.permissions);
                //console.log('docCookie:', docCookie);
                //console.log('res.data:', res.data);
                if (document.cookie){
                    return {cookie : document.cookie, res: res.data}; 
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
    //console.log('verifyOtp:', instructor, otp);
    if (!instructor._id) {
        try {
            const response = await apiClient.post('/auth/verifyOtp', { clientId:instructor._id, otpUser: otp });
            //console.log("response.status:", response.status);
            //console.log("response.data:", response.data);
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

export const deleteTheCookies =async  (idInstractor: string , otp: string) => {
    const headers = getAuthHeaders();
    
    //console.log('deleteTheCookies:', idInstractor, otp);
    if (idInstractor && headers['client-id'] && headers['otp'] && headers['client-id']!= '' && headers['otp']!= '') {
        deleteAllCookiesById(getCookieByIdINValue(idInstractor));
        try{
            const res = await apiClient.delete('/auth/deleteCookie',
                    { headers: headers });
            if (res.status === 200 && res.data.message === 'Session deleted successfully') {
                deleteAllCookiesById(getCookieByIdINValue(idInstractor));
            }
            //console.log("res.status:", res.status);
            //console.log("res:", res);
            deleteAllHeaders()
            sessionStorage.removeItem('permissions');
            return res.data;
        }catch(error){
            console.error('Error deleting cookies:', error);
        }
    }
   return {message: "Instructor not found"}; 
}