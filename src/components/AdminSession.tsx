import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Table, Modal, Form } from 'react-bootstrap';
import { ISession } from '../public/interfaces';
import { useDataContext } from '../DataContext';
import { set } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons';
import Papa from 'papaparse';

const AdminSession: React.FC = () => {
    const { sessions,addSessionFromCSV, addSession, editSession, deleteSessionInDataContext } = useDataContext();
    const sessionsComp = sessions || [];

    const [showAddSessionModal, setShowAddSessionModal] = useState(false);
    const [showEditSessionModal, setShowEditSessionModal] = useState(false);
    const [showDeleteSessionModal, setShowDeleteSessionModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<ISession | null>(null);
    const [sessionName, setSessionName] = useState('');
    const [sessionSilabus, setSessionSilabus] = useState<number[]>([]);
    const [showSessionModal, setShowSessionModal] = useState(false);
    const handleAddSessionClick = () => {
        setShowAddSessionModal(true);
    };

    const handleSessionClick = (session: ISession) => {
        setSelectedSession(session);
        setShowSessionModal(true);
    };
    const handleEditGroupClick = (session: ISession) => {
        setSelectedSession(session);
        setSessionName(session.name);
        setSessionSilabus(session.silabus);
        setShowEditSessionModal(true);
    };

    const handleDeleteSessionClick = (session: ISession) => {
        setSelectedSession(session);
        setShowDeleteSessionModal(true);
    };

    const handleCloseAddSessionModal = () => {
        setShowAddSessionModal(false);
        setSessionName('');
        setSessionSilabus([]);
    };

    const handleCloseEditSessionModal = () => {
        setShowEditSessionModal(false);
        setSelectedSession(null);
        setSessionName('');
        setSessionSilabus([]);
    };
    const handleCloseSessionModal = () => {
        setShowSessionModal(false);
        setSelectedSession(null);
    }

    const handleCloseDeleteSessionModal = () => {
        setShowDeleteSessionModal(false);
        setSelectedSession(null);
    };

    const handleSessionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSessionName(e.target.value);
    };

    const handleSessionSilabusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const silabus = e.target.value.split(',').map(Number);
        setSessionSilabus(silabus);
    };

    const handleAddNewSession = async () => {
        if (sessionName) {
            try {
                await addSession(
                     sessionName,
                     sessionSilabus
                );
                handleCloseAddSessionModal();
            } catch (error) {
                console.error('Error adding session:', error);
            }
        }
    };

    const handleSaveSession = async () => {
        if (selectedSession && selectedSession._id && sessionName) {
            try {
                await editSession(selectedSession._id, 
                     sessionName,
                     sessionSilabus
                );
                handleCloseEditSessionModal();
            } catch (error) {
                console.error('Error updating session:', error);
            }
        }
    };

    const handleConfirmDeleteSession = async () => {
        if (selectedSession && selectedSession._id) {
            try {
                await deleteSessionInDataContext(selectedSession._id);
                handleCloseDeleteSessionModal();
            } catch (error) {
                console.error('Error deleting session:', error);
            }
        }
    };

    const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        const file = fileInput.files?.[0];
        if (file) {
            //console.log('Importing trainers from CSV:', file.name);
            Papa.parse(file, {
                header: true,
                complete: async (results) => {
                    const sessionCSV: ISession[] = results.data;
                    //console.log('Trainers from CSV:', sessionCSV);
                    for (const session of sessionCSV) {
                        if (session.name) {
                            //console.log('Adding trainer from CSV:', session);
                            try {
                                if (session._id) {
                                    const silabus: number[] = typeof session.silabus === 'string' 
                                    ? session.silabus.split(',').map(Number).filter(n => !isNaN(n)) 
                                    : [];
                                    //console.log('Adding trainer from CSV with silabus:', session.silabus);
                                    await addSessionFromCSV(session._id, session.name, silabus);
                                } else {
                                    //console.log('Adding trainer from CSV without ID:', session.name);
                                    await addSession(session.name, session.silabus);
                                }
                            } catch (error) {
                                console.error('Error adding trainer from CSV:', error);
                            }
                        }
                    }
                    // Reset the file input value
                    fileInput.value = '';
                },
                error: (error) => {
                    console.error('Error parsing CSV:', error);
                    // Reset the file input value
                    fileInput.value = '';
                }
            });
        }
    };

    return (
        <div>
            <Row>
                <Col>
                    <h4>Sessions {sessionsComp.length}</h4>
                </Col>
                <Col className="text-end">
                <FontAwesomeIcon 
                icon={faPlus} 
                className='me-1'
                onClick={handleAddSessionClick} 
                style={{ cursor: 'pointer', color: 'green' }} 
                />
                <label htmlFor="import-session-csv">
                    <FontAwesomeIcon
                        icon={faFileImport}
                        className='me-1'
                        style={{ cursor: 'pointer', color: 'blue', marginLeft: '10px' }}
                        />
                </label>
                <input
                    type="file"
                    id="import-session-csv"
                    accept=".csv"
                    style={{ display: 'none' }}
                    onChange={handleImportCSV}
                />
                </Col>
            </Row>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Silabus</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sessionsComp.map((session, index) => (
                        <tr key={index}>
                            <td onClick={() => handleSessionClick(session)}>{session.name}</td>
                            <td onClick={() => handleSessionClick(session)}>{session.silabus.join(', ')}</td>
                            <td>
                                <FontAwesomeIcon
                                icon={faPen}
                                className="me-2" 
                                onClick={() => handleEditGroupClick(session)}
                                style={{ cursor: 'pointer', color: 'orange', border: '1px solid orange', borderRadius: '4px', padding: '2px' }}
                                />
                                <FontAwesomeIcon
                                icon={faTrash}
                                className='me-2'
                                onClick={() => handleDeleteSessionClick(session)}
                                style={{ cursor: 'pointer', color: 'red', border: '1px solid red', borderRadius: '4px', padding: '2px' }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showAddSessionModal} onHide={handleCloseAddSessionModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Session</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formSessionName">
                            <Form.Label>Session Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={sessionName}
                                onChange={handleSessionNameChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formSessionSilabus">
                            <Form.Label>Silabus (comma-separated numbers)</Form.Label>
                            <Form.Control
                                type="text"
                                value={sessionSilabus.join(', ')}
                                onChange={handleSessionSilabusChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddSessionModal}>Close</Button>
                    <Button variant="primary" onClick={handleAddNewSession}>Add Session</Button>
                </Modal.Footer>
            </Modal>
            {selectedSession && (
                <Modal show={showSessionModal} onHide={handleCloseSessionModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedSession.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Session ID: {selectedSession._id}</p>
                        <p>Session Name: {selectedSession.name}</p>
                        <p>Silabus: {selectedSession.silabus.join(', ')}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseSessionModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}
            {selectedSession && (
                <Modal show={showEditSessionModal} onHide={handleCloseEditSessionModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Session</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formSessionName">
                                <Form.Label>Session Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={sessionName}
                                    onChange={handleSessionNameChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formSessionSilabus">
                                <Form.Label>Silabus (comma-separated numbers)</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={sessionSilabus.join(', ')}
                                    onChange={handleSessionSilabusChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEditSessionModal}>Close</Button>
                        <Button variant="primary" onClick={handleSaveSession}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            )}

            {selectedSession && (
                <Modal show={showDeleteSessionModal} onHide={handleCloseDeleteSessionModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Session</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete {selectedSession.name}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteSessionModal}>Close</Button>
                        <Button variant="danger" onClick={handleConfirmDeleteSession}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default AdminSession;