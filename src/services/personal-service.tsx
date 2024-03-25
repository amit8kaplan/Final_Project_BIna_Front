import apiClient from "./api-client";
import { handleAccessToken } from "./user-service";

interface newData {
  email: string;
  user_name: string;
  password: string;
}
export const updateUserDetails = async (userId: string, updateUser: newData ) => {
  const headers = await handleAccessToken();
  if (!headers) return null;
  console.log("headers: ", headers)
  try {
      const change_pesonal_Data = await apiClient.put(`/user/${userId}`, updateUser, { headers });
      console.log("the register response: ", change_pesonal_Data) 
      return change_pesonal_Data
    }

   catch (error) {
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