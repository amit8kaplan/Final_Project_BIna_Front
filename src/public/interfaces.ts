

export interface IInstractor {
    name: string;
    _id?: string;
    permissions?: string;
}
export interface ITrainer{
    name: string;
    _id?: string;
}

export interface ISession{
    name: string;
    silabus: number[]; 
}

export interface IGroup{
    name: string;
    _id?: string;
    idsTrainers?: string[];
    idsInstractors?: string[];
}

export interface IResponse{
    idPost?: string;
    idDapit?: string;
    idTrainer: string;
    idInstuctor: string;
    nameInstractor: string;
    nameTrainer: string;
    content: string;
    _id?: string;
    date: Date;
}

export interface IPost{
    idTrainer: string;
    idInstractor: string;
    nameInstractor: string;
    title?: string;
    content: string;
    date: Date;
    _id?: string;
}

export interface IPersonalInstractor{
    idInstractor: string;
    idTrainer: string;
}

export interface ILikes{
    count: number;
    idDapitOrPost: string;
    flag: boolean;
    _id?: string;
}

export interface IDapit {
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
    identification: Array<{ value: number, description: string }>;
    payload: Array<{ value: number, description: string }>;
    decryption: Array<{ value: number, description: string }>;
    workingMethod: Array<{ value: number, description: string }>;
    understandingTheAir: Array<{ value: number, description: string }>;
    flight: Array<{ value: number, description: string }>;
    theoretical: Array<{ value: number, description: string }>;
    thinkingInAir: Array<{ value: number, description: string }>;
    safety: Array<{ value: number, description: string }>;
    briefing: Array<{ value: number, description: string }>;
    debriefing: Array<{ value: number, description: string }>;
    debriefingInAir: Array<{ value: number, description: string }>;
    implementationExecise: Array<{ value: number, description: string }>;
    dealingWithFailures: Array<{ value: number, description: string }>;
    dealingWithStress: Array<{ value: number, description: string }>;
    makingDecisions: Array<{ value: number, description: string }>;
    pilotNature: Array<{ value: number, description: string }>;
    crewMember: Array<{ value: number, description: string }>;
    advantage: string[];
    disavantage: string[];
    changeTobeCommender: number;
    finalGrade: number;
    summerize: string;
}