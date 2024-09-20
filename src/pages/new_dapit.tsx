import React, { useEffect, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

interface AddDapitPropsFromParent {
    instructors: string[];
    trainers: string[];
    sessions: string[];

}
const NewDapit: React.FC = () => {
    const location = useLocation();
    //console.log(location.state)
    const instructors = location.state.instructors;
    const trainers = location.state.trainers;
    const sessions = location.state.sessions;
    //console.log("Instructors: ", instructors)
    //console.log("Trainers: ", trainers)
    //console.log("Sessions: ", sessions)
    
    

    return (
        <div>

        </div>
    );
}
export default NewDapit;