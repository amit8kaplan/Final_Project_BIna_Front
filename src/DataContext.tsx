import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { IGroup, IPersonalInstractor, IInstractor, ITrainer, ISession, IDapit } from "./public/interfaces";
import { deleteInstractor,updateInstractor,updateTrainer,newInstractor,getAllGroups, getAllInstractors, getAllPersonalInstractors, getAllSessions, getAllTrainers, newTrainer,deleteTrainer } from "./services/user-info-service";
import {updatePersonalInstractor,deletePersonalInstractor, newPersonalInstractor}from "./services/user-info-service";
import {updateGroup, newGroup, deleteGroup} from "./services/user-info-service";
import {newSession,updateSession,deleteSession} from "./services/user-info-service";
import {getDapits} from "./services/dapit-serivce";
import { set } from 'react-hook-form';
interface DataContextProps {
    groups: IGroup[];
    instructors: IInstractor[];
    trainers: ITrainer[];
    sessions: ISession[];
    dapits: IDapit[];
    personalInstractors: IPersonalInstractor[];
    addTrainer: (trainerName: string) => Promise<void>;
    deleteTrainerInDataContext: (trainerId: string) => Promise<void>;
    editTrainer: (trainerId: string, trainerName: string ) => Promise<void>;
    addInstractor: (instractorName: string, email:string, permmistion: string) => Promise<void>;
    editInstractor: (instractorId:string, instractorName: string, email:string, permmistion: string) => Promise<void>;
    deleteInstractorInDataContext: (instractorId: string) => Promise<void>;
    addPersonalInstructor: (instractorId: string, trainerId:string) => Promise<void>;
    editPersonalInstructor(idPersonalInstractor: string, instractorId: string, trainerId:string): Promise<void>;
    deletePersonalInstructor: (idPersonalInstractor: string) => Promise<void>;
    editGroup: (groupId: string, name: string, idsTrainers: string[], idsInstractors: string[] ) => Promise<void>;
    addGroup: (groupName: string, idsTrainers: string[], idsInstractors: string[]) => Promise<void>;
    deleteGroupInDataContext: (groupId: string) => Promise<void>;
    addSession: (sessionName: string, sessionSilabus: number[]) => Promise<void>;
    editSession: (sessionId: string, sessionName: string, sessionSilabus: number[]) => Promise<void>;
    deleteSessionInDataContext: (sessionId: string) => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [instructors, setInstructors] = useState<IInstractor[]>([]);
    const [trainers, setTrainers] = useState<ITrainer[]>([]);
    const [sessions, setSessions] = useState<ISession[]>([]);
    const [personalInstractors, setPersonalInstractors] = useState<IPersonalInstractor[]>([]);
    const [dapits, setDapits] = useState<IDapit[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const dapits = await getDapits({});
                const groups = await getAllGroups();
                const instructors = await getAllInstractors();
                const trainers = await getAllTrainers();
                const sessions = await getAllSessions();
                const personalInstractors = await getAllPersonalInstractors();
                setDapits(dapits);
                setGroups(groups);
                setInstructors(instructors);
                setTrainers(trainers);
                setSessions(sessions);
                setPersonalInstractors(personalInstractors);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [refresh]);

    const addTrainer = async (trainerName: string) => {
        try {
            
            const res = await newTrainer(trainerName);
            if (res.data) {
                setTrainers(prevTrainers => [...prevTrainers, res.data]);
            }
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error adding trainer:', error);
        }
    };
    const deleteTrainerInDataContext = async (trainerId: string) => {
        try {
            const res = await deleteTrainer(trainerId);
            if (res.data) {
                setTrainers(prevTrainers => prevTrainers.filter(trainer => trainer._id !== trainerId));
            }
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error deleting trainer:', error);
        }
    }
    const editTrainer= async ( trainerId: string,trainerName: string) => {
        try {
            
            const res = await updateTrainer(trainerId, trainerName);
            if (res.data) {
                setTrainers(prevTrainers => [...prevTrainers, res.data]);
            }
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error adding trainer:', error);
        }
    }
    const addInstractor = async (instractorName: string, email:string, permmistion: string) => {
        try {
            const res = await newInstractor(instractorName, email, permmistion);
            if (res.data) {
                setInstructors(prevInstructors => [...prevInstructors, res.data]);
            }
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error adding instractor:', error);
        }
    }
    

    const editInstractor= async (instractorId:string, instractorName: string, email:string, permmistion: string) => {
        try {
            const res = await updateInstractor(instractorId,instractorName, email, permmistion);
            if (res.data) {
                setInstructors(prevInstructors => [...prevInstructors, res.data]);
            }
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error adding instractor:', error);
        }
    }
    const deleteInstractorInDataContext = async (instractorId: string) => {
        try {
            const res = await deleteInstractor(instractorId);
            if (res.data) {
                setInstructors(prevInstructors => prevInstructors.filter(instractor => instractor._id !== instractorId));
            }
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error deleting instractor:', error);
        }
    }
    const addPersonalInstructor = async (instractorId: string, trainerId:string) => {
        try {
            const res = await newPersonalInstractor(instractorId, trainerId);
            if (res.data) {
                setPersonalInstractors(prevPersonalInstractors => [...prevPersonalInstractors, res.data]);
            }
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error adding personal instructor:', error);
        }
    }
    const editPersonalInstructor = async (idPersonalInstractor: string, instractorId: string, trainerId:string) => {
        try {
            const res = await updatePersonalInstractor(idPersonalInstractor,instractorId, trainerId);
            if (res.data) {
                setPersonalInstractors(prevPersonalInstractors => [...prevPersonalInstractors, res.data]);
            }
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error adding personal instructor:', error);
        }
    }

    const deletePersonalInstructor = async (idPersonalInstractor: string) => {
        try {
            const res = await deletePersonalInstractor(idPersonalInstractor);
            if (res.data) {
                setPersonalInstractors(prevPersonalInstractors => prevPersonalInstractors.filter(personalInstractor => personalInstractor._id !== idPersonalInstractor));
            }
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error deleting personal instructor:', error);
        }
    }
    const editGroup = async (groupId: string,  name: string, idsTrainers: string[], idsInstractors: string[] ) => {
        try {
            //  (groupId: string, groupName: string, idsTrainers: string[], idsInstractors: string[])=>{

            const res = await updateGroup(groupId, name, idsTrainers, idsInstractors);
            if (res.data) {
                setGroups(prevGroups => prevGroups.map(group => group._id === groupId ? res.data : group));
            }
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error updating group:', error);
        }
    }
    const addGroup = async (groupName: string, idsTrainers: string[], idsInstractors: string[]) => {
        try {
            const res = await newGroup(groupName, idsTrainers, idsInstractors);
            if (res.data) {
                setGroups(prevGroups => [...prevGroups, res.data]);
            }
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error adding group:', error);
        }
    }
    const deleteGroupInDataContext = async (groupId: string) => {
        try {
            const res = await deleteGroup(groupId);
            if (res.data) {
                setGroups(prevGroups => prevGroups.filter(group => group._id !== groupId));
            }
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    }
    const addSession = async (sessionName: string, sessionSilabus: number[]) => {
        try {
            const res = await newSession(sessionName, sessionSilabus);
            if (res.data) {
                setSessions(prevSessions => [...prevSessions, res.data]);
            }
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error adding session:', error);
        }
    }
    const editSession = async (sessionId: string, sessionName: string, sessionSilabus: number[]) => {
        try {
            const res = await updateSession(sessionId, sessionName, sessionSilabus);
            if (res.data) {
                setSessions(prevSessions => [...prevSessions, res.data]);
            }
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error adding session:', error);
        }
    }
    const deleteSessionInDataContext = async (sessionId: string) => {
        try {
            const res = await deleteSession(sessionId);
            if (res.data) {
                setSessions(prevSessions => prevSessions.filter(session => session._id !== sessionId));
            }
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error deleting session:', error);
        }
    }

    return (
        <DataContext.Provider value={{
             groups, instructors, trainers, sessions, personalInstractors, dapits,
             addTrainer, deleteTrainerInDataContext,editTrainer,addInstractor,
              editInstractor,deleteInstractorInDataContext,addPersonalInstructor,
              editPersonalInstructor,deletePersonalInstructor,editGroup, addGroup,
              deleteGroupInDataContext,addSession,editSession,deleteSessionInDataContext
               }}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const context = React.useContext(DataContext);
    if (context === undefined) {
        throw new Error('useDataContext must be used within a DataContextProvider');
    }
    return context;
};