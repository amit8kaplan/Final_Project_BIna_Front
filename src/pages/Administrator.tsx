import React, { useState, useEffect } from 'react';
import useSessionStorage from '../hooks/useSessionStorage';
import { useDataContext } from '../DataContext';
import { Button, Modal, Dropdown, Form, Row, Col, Table } from 'react-bootstrap';

const Administrator: React.FC = () => {
    const { trainers, personalInstractors, instructors, groups, sessions } = useDataContext();
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
            {permission === 'admin' ? (
                <div>
                    <Button variant="primary" className="mb-3" onClick={() => {}}>Admin Actions</Button>

                    {/* Trainers Section */}
                    <Row className="mb-4">
                        <Col>
                            <h4>Trainers</h4>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trainersComp.map((trainer, index) => (
                                        <tr key={index}>
                                            <td>{trainer.name}</td>
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

                    {/* Personal Instructors Section */}
                    <Row className="mb-4">
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
                    </Row>

                    {/* Instructors Section */}
                    <Row className="mb-4">
                        <Col>
                            <h4>Instructors</h4>
                            <Table striped bordered hover responsive>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {instructorsComp.map((instructor, index) => (
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
                    </Row>

                    {/* Groups Section */}
                    <Row className="mb-4">
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
                    </Row>

                    {/* Sessions Section */}
                    <Row className="mb-4">
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
