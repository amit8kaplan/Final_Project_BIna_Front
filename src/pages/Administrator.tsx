import React, { useState, useEffect } from 'react';
import useSessionStorage from '../hooks/useSessionStorage';
import { useDataContext } from '../DataContext';
import { Button, Row, Col, Table, Modal, Form } from 'react-bootstrap';
import { IInstractor, ITrainer } from '../public/interfaces';
import AdminTrainer from '../components/AdminTraienr'
import AdminInstructor from '../components/adminInstructor';
import AdminPersonalInstructor from '../components/AdminPersonalInstructor';

const Administrator: React.FC = () => {
    const { trainers, personalInstractors, instructors, groups, sessions,
         addTrainer,deleteTrainerInDataContext ,editTrainer,addInstractor,
         editInstractor,deleteInstractorInDataContext} = useDataContext();
    const personalInstructorsComp = personalInstractors || [];
    const instructorsComp = instructors || [];
    const groupsComp = groups || [];
    const trainersComp = trainers || [];
    const sessionsComp = sessions || [];
    const permission = useSessionStorage('permissions');
    const clientID = useSessionStorage('clientId');
    const otp = useSessionStorage('otp');

    useEffect(() => {
        if (permission === 'admin') {
            console.log('admin');
        } else {
            console.log('not admin');
        }
    }, [permission]);

    
   
    return (
        <div className="container">
            {true ? (
                <div>
                    <Button variant="primary" className="mb-3" onClick={() => {}}>Admin Actions</Button>

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
                </div>
            ) : (
                <div>No Admin Access</div>
            )}

           
           
        </div>
    );
};

export default Administrator;