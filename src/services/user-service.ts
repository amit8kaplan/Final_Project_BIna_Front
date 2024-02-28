import { CredentialResponse } from "@react-oauth/google"
import apiClient from "./api-client"

export interface IUser {
    email: string,
    username: string,
    password?: string,
    imgUrl?: string,
    _id?: string,
    accessToken?: string,
    refreshToken?: string
}

export const registrUser = async (user: IUser) => (await apiClient.post("/auth/register", user)).data

export const googleSignin = async (credentialResponse: CredentialResponse) => {
    const data = (await apiClient.post("/auth/google", credentialResponse)).data;
    const { accessToken, refreshToken } = data;

    sessionStorage.setItem("accessToken", accessToken)
    sessionStorage.setItem("refreshToken", refreshToken)

    window.dispatchEvent(new CustomEvent('sessionStorageChange', { detail: { accessToken } }));
    return data;
}


