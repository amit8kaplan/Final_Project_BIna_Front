import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { IGroup, IPersonalInstractor, IInstractor, ITrainer, ISession } from "./public/interfaces";
import { deleteInstractor,updateInstractor,updateTrainer,newInstractor,getAllGroups, getAllInstractors, getAllPersonalInstractors, getAllSessions, getAllTrainers, newTrainer,deleteTrainer } from "./services/user-info-service";

interface DataContextProps {
    groups: IGroup[];
    instructors: IInstractor[];
    trainers: ITrainer[];
    sessions: ISession[];
    personalInstractors: IPersonalInstractor[];
    addTrainer: (trainerName: string) => Promise<void>;
    deleteTrainerInDataContext: (trainerId: string) => Promise<void>;
    editTrainer: (trainerId: string, trainerName: string ) => Promise<void>;
    addInstractor: (instractorName: string, email:string, permmistion: string) => Promise<void>;
    editInstractor: (instractorId:string, instractorName: string, email:string, permmistion: string) => Promise<void>;
    deleteInstractorInDataContext: (instractorId: string) => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [instructors, setInstructors] = useState<IInstractor[]>([]);
    const [trainers, setTrainers] = useState<ITrainer[]>([]);
    const [sessions, setSessions] = useState<ISession[]>([]);
    const [personalInstractors, setPersonalInstractors] = useState<IPersonalInstractor[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const groups = await getAllGroups();
                const instructors = await getAllInstractors();
                const trainers = await getAllTrainers();
                const sessions = await getAllSessions();
                const personalInstractors = await getAllPersonalInstractors();
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

    return (
        <DataContext.Provider value={{
             groups, instructors, trainers, sessions, personalInstractors,
              addTrainer, deleteTrainerInDataContext,editTrainer,addInstractor,
              editInstractor,deleteInstractorInDataContext
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