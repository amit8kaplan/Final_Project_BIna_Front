import apiClient from "./api-client";
import { getAuthHeaders,verifyRegular } from "../public/data";

export interface IDapitforSubmit {
    nameInstractor: string;
    namePersonalInstractor: string;
    nameTrainer: string;
    group: string;
    idPersonalInstractor: string;
    _id?: string;
    idInstractor: string;
    idTrainer: string;
    session?: string; // assuming it's optional
    silabus: number;
    date: Date;
    tags?: string[];
    identification: Array<{ value: number| undefined| undefined, description: string }>;
    payload: Array<{ value: number| undefined, description: string }>;
    decryption: Array<{ value: number| undefined, description: string }>;
    workingMethod: Array<{ value: number| undefined, description: string }>;
    understandingTheAir: Array<{ value: number| undefined, description: string }>;
    flight: Array<{ value: number| undefined, description: string }>;
    theoretical: Array<{ value: number| undefined, description: string }>;
    thinkingInAir: Array<{ value: number| undefined, description: string }>;
    safety: Array<{ value: number| undefined, description: string }>;
    briefing: Array<{ value: number| undefined, description: string }>;
    debriefing: Array<{ value: number| undefined, description: string }>;
    debriefingInAir: Array<{ value: number| undefined, description: string }>;
    implementationExecise: Array<{ value: number| undefined, description: string }>;
    dealingWithFailures: Array<{ value: number| undefined, description: string }>;
    dealingWithStress: Array<{ value: number| undefined, description: string }>;
    makingDecisions: Array<{ value: number| undefined, description: string }>;
    pilotNature: Array<{ value: number| undefined, description: string }>;
    crewMember: Array<{ value: number| undefined, description: string }>;
    advantage: string[];
    disavantage: string[];
    changeTobeCommender: number |  undefined;
    finalGrade: number |  undefined;
    summerize: string;
}

export const postDapit = async (dapit: IDapitforSubmit) => {

    console.log("dapit: ", dapit)
    try{
        let response;
        const headers = getAuthHeaders();
        if (!headers || !headers['client-id'] || !headers['otp']) {
            throw new Error('Client ID and OTP are required');
        }
        if (verifyRegular(headers['client-id'], dapit.idInstractor) === true ) {
             response = await apiClient.post("/dapit/postRegular", dapit, {headers} );
        }
        else 
        {
             response = await apiClient.post("/dapit/postAdmin", dapit, {headers} );
        }
        console.log("the response is:", response.data);
        return response.data;
    }
    catch (error) {
        console.error('Error posting dapit:', error);
    }
}

export const getDapits = async (filters: any) => {
    try {
        const response = await apiClient.get("/dapit/getByFilterBasicInfo", { params: filters });
        return response.data;
    } catch (error) {
        console.error('Error fetching dapits:', error);
        
    }
}

export const ChangeData = async (dapit: IDapitforSubmit) => {
    try {
        let response;
        const headers = getAuthHeaders();
        if (!headers || !headers['client-id'] || !headers['otp']) {
            throw new Error('Client ID and OTP are required');
        }
        const prevDapit = await getDapitById(dapit._id!);
        if (prevDapit.idInstractor !== dapit.idInstractor) {
            response = await apiClient.put(`/dapit/ChangeAdminData/${dapit._id}`, dapit, { headers });
        }
        else if (verifyRegular(headers['client-id'], dapit.idInstractor) === true) {
            response = await apiClient.put(`/dapit/ChangeRegularData/${dapit._id}`, dapit, { headers })
        }
        else {
            throw new Error('Not Auth Instructor ID does not match the client ID, in client side');
        }
        return response.data;
    } catch (error) {
        console.error('Error updating dapit:', error);
    }
}


export const handleFiltersSubmit = async (filterData: any) => {
    console.log("handleFilterSubmitinFront  dapit-serice: ", filterData)
    try {
      const dapits = await getDapits(filterData);
      console.log("handleFilterSubmitinFront  dapits: ", dapits)
      return dapits;
    } catch (error) {
      console.error('handleFilterSubmitinFront  Error handling filter submission:', error);
    }
  }

export const getDapitById = async (id: string) => {
    try {
        const response = await apiClient.get(`/dapit/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching dapit by id:', error);
    }
}

export const dateOnly = (date: string) => {
    let dateOnly = '';
    if (date!==null && date!==undefined){
        dateOnly = date.match(/\d{4}-\d{2}-\d{2}/)[0];
    }
    return dateOnly;
}

export const deleteAllDapitWithTrainerId = async (trainerId: string) => {
    try {
        const headers = getAuthHeaders();
        if (!headers || !headers['client-id'] || !headers['otp']) {
            throw new Error('Client ID and OTP are required');
        }
        const response = await apiClient.delete(`/dapit/deleteAllDapitWithTrainerId/`,{
            headers: headers,
            params: {trainerId},
        } );
        return response.data;
    } catch (error) {
        console.error('Error deleting all dapit with trainer id:', error);
    }
}

export const deleteAllDapitsOfGroup = async (groupId: string) => {
    try {
        const headers = getAuthHeaders();
        if (!headers || !headers['client-id'] || !headers['otp']) {
            throw new Error('Client ID and OTP are required');
        }
        const response = await apiClient.delete(`/dapit/deleteAllDapitsOfGroup/`,{
            headers: headers,
            params: {groupId},
        } );
        return response.data;
    } catch (error) {
        console.error('Error deleting all dapits of group:', error);
    }
}

export const deleteDapit = async (id: string) => {
    try {
        let response;
        const dapit = await getDapitById(id);
        const headers = getAuthHeaders();
        if (!headers || !headers['client-id'] || !headers['otp']) {
            throw new Error('Client ID and OTP are required');
        }
        if (verifyRegular(headers['client-id'], dapit.idInstractor) === true ) {
            response = await apiClient.post(`/dapit/deleteDapitRegular/${id}`, {headers} );
       }
       else 
       {
        response = await apiClient.post(`/dapit/deleteDapitAdmin/${id}`, {headers} );
        }
        return response.data;
    } catch (error) {
        console.error('Error deleting dapit:', error);
    }
}
