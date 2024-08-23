import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {groupsData, instructorsData, sessionsData, trainersData} from '../public/data';
import { megama, piano } from "../public/dropDown_NavBar";
import { right } from '@popperjs/core';

interface SidebarComProps {
    onSubmit: (filters: any) => void;
}

export function Sidebar_com({ onSubmit }: SidebarComProps) {
    const [filters, setFilters] = useState({
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
    });

    const [enabledFilters, setEnabledFilters] = useState({
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
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setEnabledFilters({
            ...enabledFilters,
            [name]: checked
        });
    };

    const handleSubmit = () => {
        const activeFilters = Object.keys(filters).reduce((acc, key) => {
            if (enabledFilters[key as keyof typeof enabledFilters]) {
                acc[key] = filters[key as keyof typeof filters];
            }
            return acc;
        }, {} as any);
        console.log("handleFilterSubmitinFront in sideBar" +JSON.stringify( activeFilters));
        onSubmit(activeFilters);
    }
    return (
        <div className="d-flex">
            <nav className="sidebar p-2" style={{ fontSize: '0.8em', borderRight: '1px solid block' ,  color: '#343a40', height: '100vh', overflowY: 'auto' }}>
                <h5>Filters</h5>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filternameInstractor" name="nameInstractor" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filternameInstractor">Instructor Name</label>
                    <select className="form-control mt-2" name="nameInstractor" value={filters.nameInstractor} onChange={handleFilterChange} disabled={!enabledFilters.nameInstractor}>
                        <option value="">Select Instructor</option>
                        {instructorsData.map((instructor, idx) => (
                            <option key={idx} value={instructor}>
                                {instructor}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterNameTrainer" name="nameTrainer" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterNameTrainer">Trainer Name</label>
                    <select className="form-control mt-2" name="nameTrainer" value={filters.nameTrainer} onChange={handleFilterChange} disabled={!enabledFilters.nameTrainer} >
                        <option value="">Select Trainer</option>
                        {trainersData.map((trainer, idx) => (
                            <option key={idx} value={trainer}>
                                {trainer}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filternamePersonalInstractor" name="namePersonalInstractor" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filternamePersonalInstractor">Personal Instructor Name</label>
                    <input type="text" className="form-control mt-2" name="namePersonalInstractor" value={filters.namePersonalInstractor} onChange={handleFilterChange} disabled={!enabledFilters.namePersonalInstractor} />
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterGroup" name="group" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterGroup">Group</label>
                    <select className="form-control mt-2" name="group" value={filters.group} onChange={handleFilterChange} disabled={!enabledFilters.group}>
                        <option value="">Select Group</option>
                        {groupsData.map((group, idx) => (
                        <option key={idx} value={group}>
                        {group}
                        </option>
                ))}
                      
                    </select>
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterSession" name="session" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterSession">Session</label>
                    <select className="form-control mt-2" name="session" value={filters.session} onChange={handleFilterChange} disabled={!enabledFilters.session}>
                        <option value="">Select Session</option>
                        {sessionsData.map((session, index) => (
                            <option key={index} value={session}>{session}</option>
                        ))}
                    </select>
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filtersilabus" name="silabus" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filtersilabus">silabus No.</label>
                    <input type="text" className="form-control mt-2" name="silabus" value={filters.silabus} onChange={handleFilterChange} disabled={!enabledFilters.silabus} />
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterFinalGrade" name="finalGrade" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterFinalGrade">Final Grade</label>
                    <input type="text" className="form-control mt-2" name="finalGrade" value={filters.finalGrade} onChange={handleFilterChange} disabled={!enabledFilters.finalGrade} />
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterchangeTobeCommender" name="changeTobeCommender" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterchangeTobeCommender">Change to be Commander</label>
                    <input type="text" className="form-control mt-2" name="changeTobeCommender" value={filters.changeTobeCommender} onChange={handleFilterChange} disabled={!enabledFilters.changeTobeCommender} />
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterStartDate" name="startDate" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterStartDate">Start Date</label>
                    <input type="date" className="form-control mt-2" name="startDate" value={filters.startDate} onChange={handleFilterChange} disabled={!enabledFilters.startDate} />
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterEndDate" name="endDate" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterEndDate">End Date</label>
                    <input type="date" className="form-control mt-2" name="endDate" value={filters.endDate} onChange={handleFilterChange} disabled={!enabledFilters.endDate} />
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
