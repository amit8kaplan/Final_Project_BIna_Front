import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { megama, piano } from "../public/dropDown_NavBar";
import { right } from '@popperjs/core';

interface SidebarWall_props {
    img: string;
    name: string;
    age: number;
    job: string;
    personalInstructor: string;
    avgGrade: number;
    }

export const SideBarWall: React.FC<SidebarWall_props> = ({ img, name, age, job, personalInstructor, avgGrade }) => {

    return (
        <div className="sidebar" style={{ fontSize: '0.8em', borderRight: '1px solid block' ,  color: '#343a40', height: '100vh', overflowY: 'auto' }}>
            <img src={img} alt="profile" style={{ width: '100%', height: 'auto' }} />
            <h5 className="mt-3">{name}</h5>
            <p>{age} years old</p>
            <p>{job}</p>
            <p>Personal Instructor: {personalInstructor}</p>
            <p>Average Grade: {avgGrade}</p>
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
