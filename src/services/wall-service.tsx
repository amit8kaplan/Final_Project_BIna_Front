import apiClient from "./api-client";



export const getWall = async (trainerId: string) => {
    try{
        console.log("trainerId: ", trainerId)
        const response = await apiClient.get(`/wall/${trainerId}`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching wall:', error);
    }
}
