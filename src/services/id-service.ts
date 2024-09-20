import apiClient from "./api-client";

export const getIdpersonalInstractor = async (trainerName:string, instractorName:string) => {
    //console.log("trainerName: ", trainerName)
    //console.log("instractorName: ", instractorName)
    try {
        const response = await apiClient.get("/dapit/getIDsBaseOnTrainerAndInstractorName", {params: {trainerName, instractorName}});
        return response.data;
    } catch (error) {
        console.error('Error fetching idpersonalInstractor:', error);
    }
}

export const getTrainerByname = async (trainerName:string) => {
    //console.log("trainerName: ", trainerName)
    try {
        const response = await apiClient.get("/user_info/getTrainerByname", {params: {trainerName}});
        return response.data;
    } catch (error) {
        console.error('Error fetching idTrainer:', error);
    }
}