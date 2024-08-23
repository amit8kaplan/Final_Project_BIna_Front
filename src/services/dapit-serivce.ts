import exp from "constants";
import apiClient from "./api-client";
import { handleAccessToken } from "./user-service";

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
        const response = await apiClient.post("/dapit/", dapit );
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