import apiClient from "./api-client";
import { getAuthHeaders,setAuthHeaders, setPermissions, setTtl } from "../public/data";
import { IInstractor } from "../public/interfaces";
import { getCookieByIdINValue, deleteAllCookiesById,setNewCookie ,getCookiesByPath} from "./cookies-service";
export const sentOtp = async (clientId: string) => {
    try {
       
        const response = await apiClient.post('/auth/sent-otp', { clientId });
        return response.data;
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
}

export const verifyOtp = async (instructor: IInstractor | undefined, otp: string, hours: number) => {
    console.log('verifyOtp:', instructor, otp);
    //find the session is open in the client side
    const headers = getAuthHeaders();
    //sent clientID and headers to verify the clientID
    if (! headers['client-id'] || !headers['otp']) {
       headers['client-id'] = "";
       headers['otp'] = "";
    }
    if ( instructor && instructor._id) {
        const prevCookies = getCookieByIdINValue(instructor._id);
        if (prevCookies.length> 1) {
            deleteAllCookiesById(prevCookies);
        }
        
        console.log('headers:', headers);
        try{
            const response = await apiClient.post('/auth/verify-otp',
                { clientId:instructor._id, otpUser: otp},
                {headers: headers });
            console.log("response.status:", response.status);
            console.log("response.data:", response.data);
            if (response.status === 200 && response.data.permissions) {
                const docCookie = setNewCookie(instructor.name, instructor._id, otp, hours, response.data.permissions); 
                if (docCookie) {
                    console.log('docCookie response.data.permissions:', docCookie, response.data.permissions);
                    setPermissions(response.data.permissions);
                    setAuthHeaders(instructor._id, otp);
                    setTtl(response.data.ttl);
                    return {cookie : document.cookie, res: response.data}; 
                }
            }
            return response.data;
        }catch (error) {
            console.error('Error verifying OTP:', error);
            if (instructor._id) {
                const cookies = getCookiesByPath(instructor._id);
                deleteAllCookiesById(cookies);
            }
        }
    }
    return {message: "Instructor not found"};
}

export const RegularDeleteSession = async () => {
    try{


        const headers = getAuthHeaders();
        if (!headers || !headers['client-id'] || !headers['otp']) {
            throw new Error('Client ID and OTP are required');
        }
        const response = await apiClient.delete('/auth/RegularDeleteSession', {headers});
        sessionStorage.removeItem('client-id');
        sessionStorage.removeItem('otp');
        sessionStorage.removeItem('ttl');
        sessionStorage.removeItem('permissions');
        return response.data;
    }
    catch (error) {
        console.error('Error deleting session:', error);
    }
}

export const AdminDeleteAllSessionExecptHimSelf = async () =>{
    try{
        const headers = getAuthHeaders();
        if (!headers || !headers['client-id'] || !headers['otp']) {
            throw new Error('Client ID and OTP are required');
        }
        const response = await apiClient.delete('/auth/AdminDeleteAllSessionExecptHimSelf', {headers});
        return response.data;
    }
    catch (error) {
        console.error('Error deleting session:', error);
    }
}

export const getAllsession = async () => {
    try {
        const response = await apiClient.get('/auth/getAllsession');
        return response.data;
    } catch (error) {
        console.error('Error fetching all session:', error);
    }
}

export const getMyTtlSession = async () => {
    try {
        const headers = getAuthHeaders();
        if (!headers || !headers['client-id'] || !headers['otp']) {
            throw new Error('Client ID and OTP are required');
        }
        const response = await apiClient.get('/auth/getMyTtlSession', {headers});
        return response.data;
    } catch (error) {
        console.error('Error fetching my session:', error);
    }
}

