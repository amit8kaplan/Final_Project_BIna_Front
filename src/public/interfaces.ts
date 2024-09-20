export interface ICookie {
        name: string;
        idInstractor: string;
        permmistion: string;
        date: string;
        ttl: number;
}

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
    _id?: string;
}

export interface ILikes{
    count: number;
    idDapitOrPost: string;
    flag: boolean;
    _id?: string;
}

export interface IdapitFromCSV {
        _id: string;
        nameInstractor: string;
        namePersonalInstractor: string;
        nameTrainer: string;
        group: string;
        idPersonalInstractor: string;
        idInstractor: string;
        idTrainer: string;
        session: string;
        silabus: string;
        date: string;
        identification_0_value: string;
        identification_0_description: string;
        payload_0_value: string;
        payload_0_description: string;
        decryption_0_value: string;
        decryption_0_description: string;
        workingMethod_0_value: string;
        workingMethod_0_description: string;
        understandingTheAir_0_value: string;
        understandingTheAir_0_description: string;
        flight_0_value: string;
        flight_0_description: string;
        theoretical_0_value: string;
        theoretical_0_description: string;
        thinkingInAir_0_value: string;
        thinkingInAir_0_description: string;
        safety_0_value: string;
        safety_0_description: string;
        briefing_0_value: string;
        briefing_0_description: string;
        debriefing_0_value: string;
        debriefing_0_description: string;
        debriefingInAir_0_value: string;
        debriefingInAir_0_description: string;
        implementationExecise_0_value: string;
        implementationExecise_0_description: string;
        dealingWithFailures_0_value: string;
        dealingWithFailures_0_description: string;
        dealingWithStress_0_value: string;
        dealingWithStress_0_description: string;
        makingDecisions_0_value: string;
        makingDecisions_0_description: string;
        pilotNature_0_value: string;
        pilotNature_0_description: string;
        crewMember_0_value: string;
        crewMember_0_description: string;
        advantage_0: string;
        advantage_1: string;
        advantage_2: string;
        disavantage_0: string;
        disavantage_1: string;
        disavantage_2: string;
        changeTobeCommender: string;
        finalGrade: string;
        summerize: string;
        __v: string;
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