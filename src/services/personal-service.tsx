import apiClient from "./api-client";
import { handleAccessToken } from "./user-service";

interface User {
    email: string;
    user_name: string;
    password?: string;
    imgUrl?: string;
    _id?: string;
    accessToken?: string;
    refreshToken?: string;
}

export const updateUserDetails = async (userId: string, userDetails: any) => {
  const headers = await handleAccessToken();
  if (!headers) return null;

  try {
    // Correctly append userId to the URL
    const response = await apiClient.put(`/user/${userId}`, userDetails, { headers });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; 
  }
};
  

const fetchUser = async () => {

    const headers = await handleAccessToken();
    console.log("the headers are:", headers)
    const userId = "1234012340"

    if (headers == null) return;
    try{
        const queryString = `/${userId}`;
        console.log("the query string is:" + queryString)
        const response = await apiClient.get(`/user${queryString}`, { headers });
        return response.data
    }
    catch (error) {
        console.error("Error fetching user:", error);
    }
}
export{
    fetchUser,
}