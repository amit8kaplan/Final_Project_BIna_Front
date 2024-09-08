

export interface IInstractor {
    name: string;
    _id?: string;
    email: string;
    permissions?: string;
}
export const defaultInstractor: IInstractor = {
    name: '',
    _id: '',
    email: '',
    permissions: ''
};

export interface ITrainer{
    name: string;
    _id?: string;
}

export const defaultTrainer: ITrainer ={
    name: "",
    _id: ""
}
export interface ISession{
    name: string;
    silabus: number[]; 
    _id?: string;
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
    idInstractor: string,
    idTrainer:string,
    session?: string; // assuming it's optional
    silabus:  number | undefined;
    date: Date;
    tags?: string[];
    identification: Array<{ value: number | undefined | undefined, description: string }>;
    payload: Array<{ value: number | undefined, description: string }>;
    decryption: Array<{ value: number | undefined, description: string }>;
    workingMethod: Array<{ value: number | undefined, description: string }>;
    understandingTheAir: Array<{ value: number | undefined, description: string }>;
    flight: Array<{ value: number | undefined, description: string }>;
    theoretical: Array<{ value: number | undefined, description: string }>;
    thinkingInAir: Array<{ value: number | undefined, description: string }>;
    safety: Array<{ value: number | undefined, description: string }>;
    briefing: Array<{ value: number | undefined, description: string }>;
    debriefing: Array<{ value: number | undefined, description: string }>;
    debriefingInAir: Array<{ value: number | undefined, description: string }>;
    implementationExecise: Array<{ value: number | undefined, description: string }>;
    dealingWithFailures: Array<{ value: number | undefined, description: string }>;
    dealingWithStress: Array<{ value: number | undefined, description: string }>;
    makingDecisions: Array<{ value: number | undefined, description: string }>;
    pilotNature: Array<{ value: number | undefined, description: string }>;
    crewMember: Array<{ value: number | undefined, description: string }>;
    advantage: string[];
    disavantage: string[];
    changeTobeCommender: number | undefined;
    finalGrade: number |  undefined;
    summerize: string;
}

// export interface IDapitData {
//     idInstractor: string,
//     idTrainer:string,
//     nameInstructor: string;
//     nameTrainer: string;
//     namePersonalInstractor: string;
//     idPersonalInstractor: string;
//     group: string;
//     session: string;
//     syllabus: string;
//     tags?: string[];
//     identification: Array<{ value: number | undefined | undefined, description: string }>;
//     payload: Array<{ value: number | undefined, description: string }>;
//     decryption: Array<{ value: number | undefined, description: string }>;
//     workingMethod: Array<{ value: number | undefined, description: string }>;
//     understandingTheAir: Array<{ value: number | undefined, description: string }>;
//     flight: Array<{ value: number | undefined, description: string }>;
//     theoretical: Array<{ value: number | undefined, description: string }>;
//     thinkingInAir: Array<{ value: number | undefined, description: string }>;
//     safety: Array<{ value: number | undefined, description: string }>;
//     briefing: Array<{ value: number | undefined, description: string }>;
//     debriefing: Array<{ value: number | undefined, description: string }>;
//     debriefingInAir: Array<{ value: number | undefined, description: string }>;
//     implementationExecise: Array<{ value: number | undefined, description: string }>;
//     dealingWithFailures: Array<{ value: number | undefined, description: string }>;
//     dealingWithStress: Array<{ value: number | undefined, description: string }>;
//     makingDecisions: Array<{ value: number | undefined, description: string }>;
//     pilotNature: Array<{ value: number | undefined, description: string }>;
//     crewMember: Array<{ value: number | undefined, description: string }>;
//     advantage: string[];
//     disavantage: string[];
//     changeTobeCommender: number | undefined;
//     finalGrade: number |  undefined;
//     summerize: string;
// }