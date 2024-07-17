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
        const response = await apiClient.post("/dapit", dapit );
        console.log("the response is:", response.data);
        return response.data;
    }
    catch (error) {
        console.error('Error posting dapit:', error);
    }
}


