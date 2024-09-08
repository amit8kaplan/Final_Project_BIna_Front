import useSessionStorage from  "../hooks/useSessionStorage";


export const instructorsData =  ["Kaplan1", "Kaplan2", "Kaplan2"];
export const trainersData = ["Amit1", "Amit2", "Amit3"];
export const sessionsData = ["Session 1", "Session 2", "Session 3"];
export const silabusPerSessionData:any = [
    {
        "Session 1": [1,2,3,4,5],
        "Session 2": [1,2],
        "Session 3": [1,2,3],
    }
];
export const groupsData = ["Group1", "Group2", "Group3"];
export const matricsData = ["Option1", "Option2", "Option3", "Option4"];
export const categoriesData = ["identification", "payload", "decryption",
     "workingMethod", "understandingTheAir", "flight", "theoretical", "thinkingInAir",
      "safety", "briefing", "debriefing", "debriefingInAir", "implementationExecise",
         "dealingWithFailures", "dealingWithStress", "makingDecisions", "pilotNature",
          "crewMember", "finalGrade", "changeTobeCommender"];

export function getAuthHeaders() {
    console.log('getAuthHeaders');
    const clientId = sessionStorage.getItem('client-id');  // Assuming clientId and OTP are stored in local storage
    const otp = sessionStorage.getItem('otp');
    
    if (!clientId || !otp) {
        return {
            'client-id': "",
            'otp': "",
        };
    }

    return {
        'client-id': clientId,
        'otp': otp,
    };
}
export function setAuthHeaders(clientId: string, otp: string) {
    if (!clientId || !otp) {
        throw new Error('Client ID and OTP are required');
    }
    sessionStorage.setItem('client-id', clientId);
    sessionStorage.setItem('otp', otp);
    if (!sessionStorage.getItem('client-id') || !sessionStorage.getItem('otp')) {
        console.error('Error setting client ID and OTP');
        return false;
    }
    console.log('setAuthHeaders:', sessionStorage.getItem("client-id"), sessionStorage.getItem("otp"));
    return true;
}

export function verifyRegular(clientID:string, InstractorId: string){
    return (clientID === InstractorId);
}

export function deleteAllHeaders (){
    sessionStorage.removeItem('client-id');
    sessionStorage.removeItem('otp');
    sessionStorage.removeItem('permissions');
}

export function setPermissions(permissions: string) {
    sessionStorage.setItem('permissions', permissions);
}

export function getPermissions() {
    return sessionStorage.getItem('permissions');
}

export function setTtl(ttl: string) {
    sessionStorage.setItem('ttl', ttl);
}