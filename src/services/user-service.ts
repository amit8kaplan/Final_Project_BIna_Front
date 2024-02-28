import { CredentialResponse } from "@react-oauth/google"
import apiClient from "./api-client"

export interface IUser {
    email: string,
    user_name: string,
    password?: string,
    imgUrl?: string,
    _id?: string,
    accessToken?: string,
    refreshToken?: string
}

export const registrUser = async (user: any) => (await apiClient.post("/auth/register", user)).data

export const googleSignin = async (credentialResponse: CredentialResponse) => {
    const data = (await apiClient.post("/auth/google", credentialResponse)).data;
    const { accessToken, refreshToken } = data;

    sessionStorage.setItem("accessToken", accessToken)
    sessionStorage.setItem("refreshToken", refreshToken)

    window.dispatchEvent(new CustomEvent('sessionStorageChange', { detail: { accessToken } }));
    return data;
}


// This could be added to your user-service.js or kept within the same file
export const loginUserWithEmailPassword = async (email: any, password: any) => {
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("refreshToken", data.refreshToken);
      window.dispatchEvent(new CustomEvent('sessionStorageChange', { detail: { accessToken: data.accessToken } }));
      console.log("the storage token is:" + sessionStorage.getItem('accessToken'))
      return true; // Login successful
    } catch (error) {
      console.error(error);
      // You might want to handle errors differently here since this will now be used programmatically
      return false; // Login failed
    }
  };
  