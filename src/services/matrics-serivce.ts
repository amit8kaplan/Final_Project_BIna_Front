


import exp from "constants";
import apiClient from "./api-client";
import { handleAccessToken } from "./user-service";



export const getMegamGradesAvg = async (group: any) => {
    try {
        const response = await apiClient.get('/matrics/getMegamGradesAvg', { params: { group } });
        return response.data;
    } catch (error) {
        console.error('Error fetching megam grades avg:', error);
    }
    
}

export const getAveragePerformance = async (group: any) => {
    try {
        const response = await apiClient.get('/matrics/getAveragePerformance', { params: { group } });
        return response.data;
    } catch (error) {
        console.error('Error fetching average performance:', error);
    }
}
