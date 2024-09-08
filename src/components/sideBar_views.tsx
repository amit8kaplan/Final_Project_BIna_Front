import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import { groupsData, instructorsData, sessionsData, trainersData } from '../public/data';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import useSessionStorage from "../hooks/useSessionStorage"
import { useDataContext } from '../DataContext';
import {ITrainer} from "../public/interfaces";
interface SidebarComProps {
    onSubmit: (filters: any) => void;
}

export function Sidebar_com({ onSubmit }: SidebarComProps) {
    const client_id = useSessionStorage('client-id');
    const otp = useSessionStorage('otp');
    const permissions = useSessionStorage('permissions');
    const { groups, instructors, trainers, sessions , personalInstractors} =  useDataContext();
    const InstractorsComp = instructors || [];
    const trainersComp = trainers || [];
    const sessionsComp = sessions || [];
    const groupsComp = groups || [];
    const personalInstractorsComp = personalInstractors || [];
    const [trainerListByGroupBoolean, setTrainerListByGroupBoolean] = useState<boolean>(false);
    const [trainerListByGroup, setTrainerListByGroup] = useState<ITrainer[]>([]);
    const [sessionSelected, setSessionSelected] = useState<boolean>(false);
    const [syllabusOptions, setSyllabusOptions] = useState<number[]>([]);

    const initialFiltersState = {
        nameInstractor: '',
        nameTrainer: '',
        namePersonalInstractor: '',
        group: '',
        session: '',
        silabus: '',
        finalGrade: '',
        changeTobeCommender: '',
        startDate: '',
        endDate: ''
    };

    const initialEnabledFiltersState = {
        nameInstractor: false,
        nameTrainer: false,
        namePersonalInstractor: false,
        group: false,
        session: false,
        silabus: false,
        finalGrade: false,
        changeTobeCommender: false,
        startDate: false,
        endDate: false
    };

    const [filters, setFilters] = useState(initialFiltersState);
    const [enabledFilters, setEnabledFilters] = useState(initialEnabledFiltersState);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, field:string ) => {
        const { name, value  } = e.target;
        console.log("handleFilterChange in sideBar" , name , value, field);
        setFilters({
            ...filters,
            [field]: value
        });
        // if (!value || value === '') {
        //     setFilters({
        //         ...filters,
        //         [field]: ''
        //     });
        // }
        if (field === 'session' && value !== '') {
            const selectedSession = sessionsComp.find(session => session.name === value);
            if (selectedSession) {
                setSessionSelected(true);
                setSyllabusOptions(selectedSession.silabus);
            }
        } else if (name === 'session' && value === '') {
            setSessionSelected(false);
            setSyllabusOptions([])
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setEnabledFilters({
            ...enabledFilters,
            [name]: checked
        });
        if (!checked) {
            setFilters({
                ...filters,
                [name]: '' // Reset the filter value to the default option
            });
        }
    };

    const handleSubmitforNone = () => {
        // Reset filters and enabledFilters to their initial state
        setFilters(initialFiltersState);
        setEnabledFilters(initialEnabledFiltersState);
        console.log("All filters cleared.");
        onSubmit({});
    }

    const handleSubmit = () => {
        const activeFilters = Object.keys(filters).reduce((acc, key) => {
            if (enabledFilters[key as keyof typeof enabledFilters]) {
                acc[key] = filters[key as keyof typeof filters];
            }
            return acc;
        }, {} as any);
        console.log("handleFilterSubmitinFront in sideBar" + JSON.stringify(activeFilters));
        onSubmit(activeFilters);
    }

    return (
        <div className="d-flex">
            <nav className="sidebar p-2" style={{ fontSize: '0.8em', borderRight: '1px solid block', color: '#343a40', height: '100vh', overflowY: 'auto' }}>
                <div className="row">
                    <div className="col-md-4">
                        <h5>Filters</h5>
                    </div>
                    <div className="col-md-8">
                        <Button variant="primary" size="sm" className="float-end" onClick={handleSubmitforNone}>
                            Clear
                        </Button>
                    </div>
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filternameInstractor" name="nameInstractor" onChange={handleCheckboxChange} checked={enabledFilters.nameInstractor} />
                    <label className="form-check-label" htmlFor="filternameInstractor">Instructor Name</label>
                    <select className="form-control mt-2" name="nameInstractor" value={filters.nameInstractor} onChange={(e) =>handleFilterChange(e, 'nameInstractor')} disabled={!enabledFilters.nameInstractor}>
                        <option value="">Select Instructor</option>
                        {InstractorsComp.map((instructor, idx) => (
                            <option key={instructor._id} value={instructor.name}>
                                {instructor.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterNameTrainer" name="nameTrainer" onChange={handleCheckboxChange} checked={enabledFilters.nameTrainer} />
                    <label className="form-check-label" htmlFor="filterNameTrainer">Trainer Name</label>
                    <select className="form-control mt-2" name="nameTrainer" value={filters.nameTrainer} onChange={(e) =>handleFilterChange(e, 'nameTrainer')} disabled={!enabledFilters.nameTrainer}>
                        <option value="">Select Trainer</option>
                        {trainerListByGroupBoolean ? (
                            trainerListByGroup.map((trainer) => (
                                <option key={trainer._id!} value={trainer.name} data-id={trainer._id!}>
                                {trainer.name}
                                </option>
                            ))
                            ) : (
                            trainers.map((trainer) => (
                                <option key={trainer._id!} value={trainer.name} data-id={trainer._id!}>
                                {trainer.name}
                                </option>
                            ))
                            )}
                    </select>
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filternamePersonalInstractor" name="namePersonalInstractor" onChange={handleCheckboxChange} checked={enabledFilters.namePersonalInstractor} />
                    <label className="form-check-label" htmlFor="filternamePersonalInstractor">Personal Instructor Name</label>
                    <input type="text" className="form-control mt-2" name="namePersonalInstractor" value={filters.namePersonalInstractor} onChange={(e) =>handleFilterChange(e, 'namePersonalInstractor')} disabled={!enabledFilters.namePersonalInstractor} />
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterGroup" name="group" onChange={handleCheckboxChange} checked={enabledFilters.group} />
                    <label className="form-check-label" htmlFor="filterGroup">Group</label>
                    <select className="form-control mt-2" name="group" value={filters.group} onChange={(e) =>handleFilterChange(e, 'group')} disabled={!enabledFilters.group}>
                        <option value="">Select Group</option>
                            {groupsComp.map((group) => (
                                <option key={group._id!} value={group.name} data-id={group._id!}>
                                    {group.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterSession" name="session" onChange={handleCheckboxChange} checked={enabledFilters.session} />
                    <label className="form-check-label" htmlFor="filterSession">Session</label>
                    <select className="form-control mt-2" name="session" value={filters.session} onChange={(e) =>handleFilterChange(e, 'session')} disabled={!enabledFilters.session}>
                        <option value="">Select Session</option>
                            {sessionsComp.map((session, idx) => (
                                <option key={session._id} value={session.name} data-id={session._id!}>
                                    {session.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filtersilabus" name="silabus" onChange={handleCheckboxChange} checked={enabledFilters.silabus} />
                    <label className="form-check-label" htmlFor="filtersilabus">Syllabus</label>
                    {sessionSelected && filters.session ? (
                        <Form.Control
                            as="select"
                            value={filters.silabus}
                            onChange={(e) =>handleFilterChange(e, 'silabus')}
                            name="silabus"
                            disabled={!enabledFilters.silabus}
                        >
                            <option value="">Select Syllabus</option>
                            {syllabusOptions.map((silabus, idx) => (
                                <option key={idx} value={silabus}>
                                    {silabus}
                                </option>
                            ))}
                        </Form.Control>
                    ) : (
                        <input type="text" className="form-control mt-2" name="silabus" value={filters.silabus} onChange={(e) =>handleFilterChange(e, 'silabus')} disabled={!enabledFilters.silabus} />
                    )}
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterFinalGrade" name="finalGrade" onChange={handleCheckboxChange} checked={enabledFilters.finalGrade} />
                    <label className="form-check-label" htmlFor="filterFinalGrade">Final Grade</label>
                    <input type="text" className="form-control mt-2" name="finalGrade" value={filters.finalGrade} onChange={(e) =>handleFilterChange(e, 'finalGrade')} disabled={!enabledFilters.finalGrade} />
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterchangeTobeCommender" name="changeTobeCommender" onChange={handleCheckboxChange} checked={enabledFilters.changeTobeCommender} />
                    <label className="form-check-label" htmlFor="filterchangeTobeCommender">Change to be Commander</label>
                    <input type="text" className="form-control mt-2" name="changeTobeCommender" value={filters.changeTobeCommender} onChange={(e) =>handleFilterChange(e, 'changeTobeCommender')} disabled={!enabledFilters.changeTobeCommender} />
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterStartDate" name="startDate" onChange={handleCheckboxChange} checked={enabledFilters.startDate} />
                    <label className="form-check-label" htmlFor="filterStartDate">Start Date</label>
                    <input type="date" className="form-control mt-2" name="startDate" value={filters.startDate} onChange={(e) =>handleFilterChange(e, 'startDate')} disabled={!enabledFilters.startDate} />
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterEndDate" name="endDate" onChange={handleCheckboxChange} checked={enabledFilters.endDate} />
                    <label className="form-check-label" htmlFor="filterEndDate">End Date</label>
                    <input type="date" className="form-control mt-2" name="endDate" value={filters.endDate} onChange={(e) =>handleFilterChange(e, 'endDate')} disabled={!enabledFilters.endDate} />
                </div>
                <button className="btn btn-primary mt-3" onClick={handleSubmit}>Submit</button>
            </nav>
            <style>{`
                .sidebar::-webkit-scrollbar {
                    width: 12px;
                }
                .sidebar::-webkit-scrollbar-track {
                    background: #f8f9fa;
                }
                .sidebar::-webkit-scrollbar-thumb {
                    background-color: #343a40;
                    border-radius: 20px;
                    border: 3px solid #f8f9fa;
                }
            `}</style>
        </div>
    );
}
