import apiClient from "./api-client";
import { IInstractor, ITrainer, IGroup, ISession } from "../public/interfaces";
import { getAuthHeaders } from "../public/data";


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
        const trainerData:ITrainer ={
            name: trainerName,
            _id: trainerId
        }
        const response = await apiClient.put("/user_info/updateTrainer",trainerData, {
            headers: headers,
            params: { trainerId }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating trainer:', error);
    }
}

export const updateInstractor = async (instractorId: string, instractorName: string, permissions: string)=>{
    try {
        const headers = getAuthHeaders()
        const instractorData:IInstractor ={
            name: instractorName,
            permissions: permissions,
            _id: instractorId
        }
        const response = await apiClient.put("/user_info/updateInstractor",instractorData, {
            headers: headers,
            params: { instractorId }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating instractor:', error);
    }
}

export const updateGroup = async (groupId: string, groupName: string, idsTrainers: string[], idsInstractors: string[])=>{
    try {
        const headers = getAuthHeaders()
        const groupData: IGroup ={
            name: groupName,
            idsTrainers: idsTrainers,
            idsInstractors: idsInstractors,
            _id: groupId
        }
        const response = await apiClient.put("/user_info/updateGroup",groupData, {
            headers: headers,
            params: { groupId }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating group:', error);
    }
}

export const updateSession = async (sessionId: string, sessionName: string, silabuses: number[])=>{
    try {
        const headers = getAuthHeaders()
        const sessionData:ISession = {
            name: sessionName,
            silabus: silabuses,
            _id: sessionId
        }
        const response = await apiClient.put("/user_info/updateSession",sessionData, {
            headers: headers,
            params: { sessionId }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating session:', error);
    }
}

export const updatePersonalInstractor = async (personalInstractorId: string, instractorName: string, TrainerName: string)=>{
    try {
        const headers = getAuthHeaders();
        const response = await apiClient.put("/user_info/updatePersonalInstractor", {instractorName, TrainerName, _id: personalInstractorId}, {headers});
        return response.data;
    } catch (error) {
        console.error('Error updating personal instractor:', error);
    }
}

export const updateIdsTrainersInGroup = async (groupId: string, trainerId: string)=>{
    try {
        const headers = getAuthHeaders();
        const response = await apiClient.put("/user_info/updateIdsTrainersInGroup", {groupId, trainerId}, {headers});
        return response.data;
    } catch (error) {
        console.error('Error updating group:', error);
    }
}

export const updateIdsInstractorsInGroup = async (groupId: string, instractorId: string)=>{
    try {
        const headers = getAuthHeaders();
        const response = await apiClient.put("/user_info/updateIdsInstractorsInGroup", {groupId, instractorId}, {headers});
        return response.data;
    } catch (error) {
        console.error('Error updating group:', error);
    }
}

/**
 * @router DELETE
 */

export const deleteTrainer = async (trainerId: string)=>{
    try {
        const headers = getAuthHeaders()
        const response = await apiClient.delete("/user_info/deleteTrainer", {
            headers: headers,
            params: { trainerId }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting trainer:', error);
    }
}

export const deletePersonalInstractorAfterDeleteTrainer = async (trainerId: string)=>{
    
    try {
        const headers = getAuthHeaders()
        const resDeleteTrainer = await apiClient.delete("/user_info/deleteTrainer", {
            headers: headers,
            params: { trainerId }
        });
        const response = await apiClient.delete("/user_info/deletePersonalInstractorAfterDeleteTrainer", {
            headers: headers,
            params: { trainerId }
        });
        return { 
            responseData: response.data, 
            resDeleteTrainerData: resDeleteTrainer.data 
        };
    } catch (error) {
        console.error('Error deleting personal instractor:', error);
    }
}

export const deleteInstractor = async (instractorId: string)=>{
    try {
        const headers = getAuthHeaders()
        const response = await apiClient.delete("/user_info/deleteInstractor", {
            headers: headers,
            params: { instractorId }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting instractor:', error);
    }
}

export const deleteGroup = async (groupId: string)=>{
    try {
        const headers = getAuthHeaders()
        const response = await apiClient.delete("/user_info/deleteGroup", {
            headers: headers,
            params: { groupId }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting group:', error);
    }
}

export const deleteSpesificTrainerFromGroup = async (groupId: string, trainerId: string)=>{
    try {
        const headers = getAuthHeaders()
        const response = await apiClient.delete("/user_info/deleteSpesificTrainerFromGroup", {
            headers: headers,
            params: { groupId, trainerId }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting group:', error);
    }
}

export const deleteSession = async (sessionId: string)=>{
    try {
        const headers = getAuthHeaders()
        const response = await apiClient.delete("/user_info/deleteSession", {
            headers: headers,
            params: { sessionId }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting session:', error);
    }
}

export const deleteSpesificSilabusFromSession = async (sessionId: string, silabus: number)=>{
    try {
        const headers = getAuthHeaders()
        const response = await apiClient.delete("/user_info/deleteSpesificSilabusFromSession", {
            headers: headers,
            params: { sessionId, silabus }
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting session:', error);
    }
}