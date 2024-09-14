import React, { useState, useEffect } from 'react';
import useSessionStorage from '../hooks/useSessionStorage';
import { useDataContext } from '../DataContext';
import { Button, Row, Col, Table, Modal, Form } from 'react-bootstrap';
import { ITrainer } from '../public/interfaces';

const Administrator: React.FC = () => {
    const { trainers, personalInstractors, instructors, groups, sessions,
         addTrainer,deleteTrainerInDataContext } = useDataContext();
    const personalInstructorsComp = personalInstractors || [];
    const instructorsComp = instructors || [];
    const groupsComp = groups || [];
    const trainersComp = trainers || [];
    const sessionsComp = sessions || [];
    const permission = useSessionStorage('permissions');
    const clientID = useSessionStorage('clientId');
    const otp = useSessionStorage('otp');

    const [showTrainerModal, setShowTrainerModal] = useState(false);
    const [showEditTrainerModal, setShowEditTrainerModal] = useState(false);
    const [showDeleteTrainerModal, setShowDeleteTrainerModal] = useState(false);
    const [showAddTrainerModal, setShowAddTrainerModal] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState<ITrainer | null>(null);
    const [trainerName, setTrainerName] = useState('');
    const [newTrainerName, setNewTrainerName] = useState('');
    const [duplicateTrainerMessage, setDuplicateTrainerMessage] = useState('');

    useEffect(() => {
        if (permission === 'admin') {
            console.log('admin');
        } else {
            console.log('not admin');
        }
    }, [permission]);

    const handleTrainerClick = (trainer: ITrainer) => {
        setSelectedTrainer(trainer);
        setShowTrainerModal(true);
    };

    const handleEditTrainerClick = (trainer: ITrainer) => {
        setSelectedTrainer(trainer);
        setTrainerName(trainer.name);
        setShowEditTrainerModal(true);
    };

    const handleDeleteTrainerClick = (trainer: ITrainer) => {
        setSelectedTrainer(trainer);
        setShowDeleteTrainerModal(true);
    };

    const handleAddTrainerClick = () => {
        setShowAddTrainerModal(true);
    };

    const handleCloseTrainerModal = () => {
        setShowTrainerModal(false);
        setSelectedTrainer(null);
    };

    const handleCloseEditTrainerModal = () => {
        setShowEditTrainerModal(false);
        setSelectedTrainer(null);
    };

    const handleCloseDeleteTrainerModal = () => {
        setShowDeleteTrainerModal(false);
        setSelectedTrainer(null);
    };

    const handleCloseAddTrainerModal = () => {
        setShowAddTrainerModal(false);
        setNewTrainerName('');
        setDuplicateTrainerMessage('');
    };

    const handleTrainerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTrainerName(e.target.value);
    };

    const handleNewTrainerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const trainerName = e.target.value;
        setNewTrainerName(trainerName);

        const duplicateTrainer = trainersComp.find(trainer => trainer.name.toLowerCase() === trainerName.toLowerCase());
        if (duplicateTrainer) {
            setDuplicateTrainerMessage('A trainer with this name already exists.');
        } else {
            setDuplicateTrainerMessage('');
        }
    };

    const handleSaveTrainerName = () => {
        if (selectedTrainer) {
            // Update the trainer's name (this should ideally be done via an API call)
            selectedTrainer.name = trainerName;
            setShowEditTrainerModal(false);
            setSelectedTrainer(null);
        }
    };

    const handleConfirmDeleteTrainer = async() => {
        if (selectedTrainer && selectedTrainer._id) {
            try{
                await deleteTrainerInDataContext(selectedTrainer._id);
                setShowDeleteTrainerModal(false);
                setSelectedTrainer(null);
            }
            catch(error){
                console.error('Error deleting trainer:', error);
            }
        }
    };

    const handleAddNewTrainer = async () => {
        if (newTrainerName && !duplicateTrainerMessage) {
            try {
                await addTrainer(newTrainerName);
                setShowAddTrainerModal(false);
                setNewTrainerName('');
            } catch (error) {
                console.error('Error adding trainer:', error);
            }
        }
    };

    return (
        <div className="container">
            {true ? (
                <div>
                    <Button variant="primary" className="mb-3" onClick={() => {}}>Admin Actions</Button>

                    <Row className="mb-4">
                        {/* Trainers Section */}
                        <Col>
                            <Row>
                                <Col>
                                    <h4>Trainers {trainersComp.length}</h4>
                                </Col>
                                <Col className="text-end">
                                    <Button variant="success" size="sm" className="me-1" onClick={handleAddTrainerClick}>Add</Button>
                                </Col>
                            </Row>
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
                                            <td onClick={() => handleTrainerClick(trainer)}>{trainer.name}</td>
                                            <td>
                                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditTrainerClick(trainer)}>Edit</Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteTrainerClick(trainer)}>Delete</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
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

                        {/* Instructors Section */}
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

            {selectedTrainer && (
                <Modal show={showTrainerModal} onHide={handleCloseTrainerModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedTrainer.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Trainer ID: {selectedTrainer._id}</p>
                        <p>Trainer Name: {selectedTrainer.name}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseTrainerModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}

            {selectedTrainer && (
                <Modal show={showEditTrainerModal} onHide={handleCloseEditTrainerModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Trainer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formTrainerName">
                                <Form.Label>Trainer Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={trainerName}
                                    onChange={handleTrainerNameChange}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEditTrainerModal}>Close</Button>
                        <Button variant="primary" onClick={handleSaveTrainerName}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            )}

            <Modal show={showAddTrainerModal} onHide={handleCloseAddTrainerModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Trainer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formNewTrainerName">
                            <Form.Label>Trainer Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newTrainerName}
                                onChange={handleNewTrainerNameChange}
                            />
                            {duplicateTrainerMessage && (
                                <Form.Text className="text-danger">
                                    {duplicateTrainerMessage}
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddTrainerModal}>Close</Button>
                    <Button variant="primary" onClick={handleAddNewTrainer} disabled={!!duplicateTrainerMessage}>Add Trainer</Button>
                </Modal.Footer>
            </Modal>

            {selectedTrainer && (
                <Modal show={showDeleteTrainerModal} onHide={handleCloseDeleteTrainerModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Trainer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete {selectedTrainer.name}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteTrainerModal}>Close</Button>
                        <Button variant="danger" onClick={handleConfirmDeleteTrainer}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default Administrator;