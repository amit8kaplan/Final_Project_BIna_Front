import React, { useState, useEffect } from 'react';
import useSessionStorage from '../hooks/useSessionStorage';
import { useDataContext } from '../DataContext';
import { Button, Row, Col, Table, Modal, Form } from 'react-bootstrap';
import { IInstractor, ITrainer } from '../public/interfaces';
import AdminTrainer from '../components/AdminTraienr'
import AdminInstructor from '../components/AdminInstructor';

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
                        

                      
                        {/* Personal Instructors Section */}
                        <Col>
                            <h4>Personal Instructors</h4>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {personalInstructorsComp.map((instructor, index) => (
                                        <tr key={index}>
                                            <td>{instructor.name}</td>
                                            <td>
                                                <Button variant="success" size="sm" className="me-2">Add</Button>
                                                <Button variant="warning" size="sm" className="me-2">Edit</Button>
                                                <Button variant="danger" size="sm">Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                        {/* Groups Section */}
                        <Col>
                            <h4>Groups</h4>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Group Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupsComp.map((group, index) => (
                                        <tr key={index}>
                                            <td>{group.name}</td>
                                            <td>
                                                <Button variant="success" size="sm" className="me-2">Add</Button>
                                                <Button variant="warning" size="sm" className="me-2">Edit</Button>
                                                <Button variant="danger" size="sm">Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                        {/* Sessions Section */}
                        <Col>
                            <h4>Sessions</h4>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Session ID</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sessionsComp.map((session, index) => (
                                        <tr key={index}>
                                            <td>{session.sessionId}</td>
                                            <td>
                                                <Button variant="success" size="sm" className="me-2">Add</Button>
                                                <Button variant="warning" size="sm" className="me-2">Edit</Button>
                                                <Button variant="danger" size="sm">Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
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