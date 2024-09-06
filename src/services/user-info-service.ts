import apiClient from "./api-client";
import { IInstractor, ITrainer, IPersonalInstractor, IGroup, ISession } from "../public/interfaces";



/**
 * @router get
 */
export const getAllPersonalInstractors = async () => {
    try {
        const response = await apiClient.get("/user_info/getAllPersonalInstractors");
        return response.data;
    } catch (error) {
        console.error('Error fetching personal instractors:', error);
    }
}

export const getAllTrainers = async () => {
    try {
        const response = await apiClient.get("/user_info/getAllTrainers");
        return response.data;
    } catch (error) {
        console.error('Error fetching trainers:', error);
    }
}

export const getAllInstractors = async () => {
    try {
        const response = await apiClient.get("/user_info/getAllInstractors");
        return response.data;
    } catch (error) {
        console.error('Error fetching instractors:', error);
    }
}

export const getTrainerByname = async (trainerName: string) => {
    try {
        const response = await apiClient.get("/user_info/getTrainerByName", { params: { trainerName } });
        return response.data;
    } catch (error) {
        console.error('Error fetching trainer:', error);
    }
}

export const getTrainerById = async (trainerId: string) => {
    try {
        const response = await apiClient.get("/user_info/getTrainerById", { params: { trainerId } });
        return response.data;
    } catch (error) {
        console.error('Error fetching trainer:', error);
    }
}

export const getInstractorByname = async (instractorName: string) => {
    try {
        const response = await apiClient.get("/user_info/getInstractorByName", { params: { instractorName } });
        return response.data;
    } catch (error) {
        console.error('Error fetching instractor:', error);
    }
}

export const getInstractorById = async (instractorId: string) => {
    try {
        const response = await apiClient.get("/user_info/getInstractorById", { params: { instractorId } });
        return response.data;
    } catch (error) {
        console.error('Error fetching instractor:', error);
    }
}

export const getAllGroups = async () => {
    try {
        const response = await apiClient.get("/user_info/getAllGroups");
        return response.data;
    } catch (error) {
        console.error('Error fetching groups:', error);
    }
}

export const getAllSessions = async () => {
    try {
        const response = await apiClient.get("/user_info/getAllSessions");
        return response.data;
    } catch (error) {
        console.error('Error fetching sessions:', error);
    }
}
/*
 * auth
*/

function getAuthHeaders() {
    const clientId = localStorage.getItem('client-id');  // Assuming clientId and OTP are stored in local storage
    const otp = localStorage.getItem('otp');
    
    if (!clientId || !otp) {
        throw new Error('Client ID and OTP are required');
    }

    return {
        'client-id': clientId,
        'otp': otp,
    };
}


/**
 * @router POST
 */


export const newPersonalInstractor = async (instractorName: string, trainerName:String)=>{
    try {
        const headers = getAuthHeaders();
        const response = await apiClient.post("/user_info/newPersonalInstractor", {instractorName, trainerName}, {headers});
        return response.data;
    } catch (error) {
        console.error('Error creating personal instractor:', error);
    }
}

export const newTrainer = async (trainerName: string)=>{
    try {
        const trainerData:ITrainer ={
            name: trainerName
        }
        const headers = getAuthHeaders()
        const response = await apiClient.post("/user_info/newTrainer", {trainerData}, {headers});
        return response.data;
    } catch (error) {
        console.error('Error creating trainer:', error);
    }
}

export const newInstractor = async ( instractorName: string, permissions: string)=>{
    try {
        const instractorData:IInstractor ={
            name: instractorName,
            permissions: permissions
        }
        const headers = getAuthHeaders()
        const response = await apiClient.post("/user_info/newInstractor", instractorData, {headers});
        return response.data;
    } catch (error) {
        console.error('Error creating instractor:', error);
    }
}

export const newGroup = async (groupName: string, idsTrainers: string[], idsInstractors: string[])=>{
    try {
        const headers = getAuthHeaders()
        const groupData: IGroup ={
            name: groupName,
            idsTrainers: idsTrainers,
            idsInstractors: idsInstractors
        }
        const response = await apiClient.post("/user_info/newGroup",groupData, {headers});
        return response.data;
    } catch (error) {
        console.error('Error creating group:', error);
    }
}

export const newSession = async ( sessionName: string, silabuses: number[])=>{
    try {
        const headers = getAuthHeaders()
        const sessionData:ISession = {
            name: sessionName,
            silabus: silabuses
        }
        const response = await apiClient.post("/user_info/newSession",sessionData, {headers});
        return response.data;
    } catch (error) {
        console.error('Error creating session:', error);
    }
}

/**
 * @router PUT
 */

export const updateTrainer = async (trainerId: string, trainerName: string)=>{
    try {
        const headers = getAuthHeaders()
        const response = await apiClient.put("/user_info/updateTrainer", {trainerId, trainerName}, {headers});
        return response.data;
    } catch (error) {
        console.error('Error updating trainer:', error);
    }
}