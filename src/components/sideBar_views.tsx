import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { megama, piano } from "../public/dropDown_NavBar";
import { right } from '@popperjs/core';

interface SidebarComProps {
    onSubmit: (filters: any) => void;
}

export function Sidebar_com({ onSubmit }: SidebarComProps) {
    const [filters, setFilters] = useState({
        nameInstructor: '',
        nameTrainer: '',
        namePersonalInstructor: '',
        group: '',
        session: '',
        syllabus: '',
        grade: '',
        finalGrade: '',
        changeToBeCommander: '',
        startDate: '',
        endDate: ''
    });

    const [enabledFilters, setEnabledFilters] = useState({
        nameInstructor: false,
        nameTrainer: false,
        namePersonalInstructor: false,
        group: false,
        session: false,
        syllabus: false,
        grade: false,
        finalGrade: false,
        changeToBeCommander: false,
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
        console.log(activeFilters);
        onSubmit(activeFilters);
    }
    return (
        <div className="d-flex">
            <nav className="sidebar p-2" style={{ fontSize: '0.8em', borderRight: '1px solid block' ,  color: '#343a40', height: '100vh', overflowY: 'auto' }}>
                <h5>Filters</h5>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterNameInstructor" name="nameInstructor" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterNameInstructor">Instructor Name</label>
                    <input type="text" className="form-control mt-2" name="nameInstructor" value={filters.nameInstructor} onChange={handleFilterChange} disabled={!enabledFilters.nameInstructor} />
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterNameTrainer" name="nameTrainer" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterNameTrainer">Trainer Name</label>
                    <input type="text" className="form-control mt-2" name="nameTrainer" value={filters.nameTrainer} onChange={handleFilterChange} disabled={!enabledFilters.nameTrainer} />
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterNamePersonalInstructor" name="namePersonalInstructor" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterNamePersonalInstructor">Personal Instructor Name</label>
                    <input type="text" className="form-control mt-2" name="namePersonalInstructor" value={filters.namePersonalInstructor} onChange={handleFilterChange} disabled={!enabledFilters.namePersonalInstructor} />
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterGroup" name="group" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterGroup">Group</label>
                    <select className="form-control mt-2" name="group" value={filters.group} onChange={handleFilterChange} disabled={!enabledFilters.group}>
                        <option value="">Select Group</option>
                        {megama[0].items.map((item, index) => (
                            <option key={index} value={item.label}>{item.label}</option>
                        ))}
                    </select>
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterSession" name="session" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterSession">Session</label>
                    <select className="form-control mt-2" name="session" value={filters.session} onChange={handleFilterChange} disabled={!enabledFilters.session}>
                        <option value="">Select Session</option>
                        {piano[0].items.map((item, index) => (
                            <option key={index} value={item.label}>{item.label}</option>
                        ))}
                    </select>
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterSyllabus" name="syllabus" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterSyllabus">Syllabus No.</label>
                    <input type="text" className="form-control mt-2" name="syllabus" value={filters.syllabus} onChange={handleFilterChange} disabled={!enabledFilters.syllabus} />
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterGrade" name="grade" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterGrade">Grade</label>
                    <input type="text" className="form-control mt-2" name="grade" value={filters.grade} onChange={handleFilterChange} disabled={!enabledFilters.grade} />
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterFinalGrade" name="finalGrade" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterFinalGrade">Final Grade</label>
                    <input type="text" className="form-control mt-2" name="finalGrade" value={filters.finalGrade} onChange={handleFilterChange} disabled={!enabledFilters.finalGrade} />
                </div>
                <div className="form-check mt-3">
                    <input type="checkbox" className="form-check-input" id="filterChangeToBeCommander" name="changeToBeCommander" onChange={handleCheckboxChange} />
                    <label className="form-check-label" htmlFor="filterChangeToBeCommander">Change to be Commander</label>
                    <input type="text" className="form-control mt-2" name="changeToBeCommander" value={filters.changeToBeCommander} onChange={handleFilterChange} disabled={!enabledFilters.changeToBeCommander} />
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
