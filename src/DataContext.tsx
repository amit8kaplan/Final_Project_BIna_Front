import React, { createContext, useState, useEffect, ReactNode } from 'react';
import {IGroup, IPersonalInstractor, IInstractor, ITrainer, ISession} from "./public/interfaces";
import {getAllGroups, getAllInstractors, getAllPersonalInstractors, getAllSessions, getAllTrainers} from "./services/user-info-service"
interface DataContextProps {
    groups: IGroup[];
    instructors: IInstractor[];
    trainers: ITrainer[];
    sessions: ISession[];
    personalInstractors: IPersonalInstractor[];
}

const DataContext = createContext<DataContextProps|undefined>(undefined);

export const DataContextProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [instructors, setInstructors] = useState<IInstractor[]>([]);
    const [trainers, setTrainers] = useState<ITrainer[]>([]);
    const [sessions, setSessions] = useState<ISession[]>([]);
    const [personalInstractors, setPersonalInstractors] = useState<IPersonalInstractor[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const groups =await getAllGroups();
                const instructors =await getAllInstractors();
                const trainers =await getAllTrainers();
                const sessions =await getAllSessions();
                const personalInstractors =await getAllPersonalInstractors();
                setGroups(groups);
                setInstructors(instructors);
                setTrainers(trainers);
                setSessions(sessions);
                setPersonalInstractors(personalInstractors);
            } catch (error) {
                console.error('Error submitting dapit:', error);    
            } 
        };
        fetchData();
    }, []);

    return (
        <DataContext.Provider value={{groups, instructors, trainers, sessions, personalInstractors}}>
            {children}
        </DataContext.Provider>
    );
}

export const useDataContext = () => {
    const context = React.useContext(DataContext);
    if (context === undefined) {
        throw new Error('useDataContext must be used within a DataContextProvider');
    }
    return context;
};