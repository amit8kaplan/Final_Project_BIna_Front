import React, { useState, useEffect } from 'react';
import useSessionStorage from '../hooks/useSessionStorage';
import { useDataContext } from '../DataContext';
import { Button, Row, Col } from 'react-bootstrap';
import AdminTrainer from '../components/AdminTraienr';
import AdminInstructor from '../components/adminInstructor';
import AdminPersonalInstructor from '../components/AdminPersonalInstructor';
import AdminGroup from '../components/AdminGroup';
import AdminSession from '../components/AdminSession';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import { exportAllDataToCSV } from '../services/csv-serivce';


const Administrator: React.FC = () => {
    const { sessions, instructors, groups, trainers, personalInstractors, dapits } = useDataContext();
    const sessionComp = sessions || [];
    const instructorComp = instructors || [];
    const groupComp = groups || [];
    const trainerComp = trainers || [];
    const personalInstractorComp = personalInstractors || [];
    const dapitComp = dapits || [];
    
    const [show, setShow] = useState(false);
    const permission = useSessionStorage('permissions');
    useEffect(() => {
        if (permission === 'admin') {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [permission]);

    const handleExport = () => {
        exportAllDataToCSV({ sessions, instructors, groups, trainers, personalInstractors, dapits });
    };

    return (
        <div className="container">
            {show ? (
                <div className="" style={{marginTop: "40px" }}>
                    <FontAwesomeIcon 
                    icon={faFileExport}
                    className="mb-4"
                    onClick={handleExport}
                    style={{cursor: "pointer"}}
                     />
                    <Row className="mb-4">
                        <Col>
                            <AdminTrainer />
                        </Col>
                        <Col>
                            <AdminInstructor />
                        </Col>
                        <Col>
                            <AdminPersonalInstructor />
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        <Col>
                            <AdminGroup />
                        </Col>
                        <Col>
                            <AdminSession />
                        </Col>
                    </Row>
                </div>
            ) : (
                <div>No Admin Access</div>
            )}
        </div>
    );
};

export default Administrator;