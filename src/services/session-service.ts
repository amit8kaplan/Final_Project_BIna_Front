import apiClient from "./api-client";
import { getAuthHeaders,setAuthHeaders } from "../public/data";
import { IInstractor } from "../public/interfaces";
export const sentOtp = async (clientId: string) => {
    try {
       
        const response = await apiClient.post('/auth/sent-otp', { clientId });
        return response.data;
    } catch (error) {
        console.error('Error sending OTP:', error);
    }
}

export const verifyOtp = async (clientId: string, otp: string) => {
    console.log('verifyOtp:', clientId, otp);
    //find the session is open in the client side
    const headers = getAuthHeaders();
    //sent clientID and headers to verify the clientID
    if (! headers['client-id'] || !headers['otp']) {
       headers['client-id'] = "";
       headers['otp'] = "";
    }
    console.log('headers:', headers);
    try{
         const response = await apiClient.post('/auth/verify-otp', { clientId:clientId, otpUser: otp}, {headers: headers });
         console.log("response.status:", response.status);
         console.log("response.data:", response.data);
         if (response.status === 200) {

            setAuthHeaders(clientId, otp);
         }
         return response.data;
         
    }catch (error) {
        console.error('Error verifying OTP:', error);
    }
}

export const RegularDeleteSession = async () => {
    try{
        const headers = getAuthHeaders();
        if (!headers || !headers['client-id'] || !headers['otp']) {
            throw new Error('Client ID and OTP are required');
        }
        const response = await apiClient.delete('/auth/RegularDeleteSession', {headers});
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