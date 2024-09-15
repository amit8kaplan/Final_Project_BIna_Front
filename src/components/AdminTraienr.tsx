import React, { useState } from 'react';
import { Button, Row, Col, Table, Modal, Form } from 'react-bootstrap';
import { ITrainer } from '../public/interfaces';
import { useDataContext } from '../DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const AdminTrainer: React.FC = () => {
    const { trainers, addTrainer, editTrainer, deleteTrainerInDataContext } = useDataContext();
    const trainersComp = trainers || [];

    const [showTrainerModal, setShowTrainerModal] = useState(false);
    const [showEditTrainerModal, setShowEditTrainerModal] = useState(false);
    const [showDeleteTrainerModal, setShowDeleteTrainerModal] = useState(false);
    const [showAddTrainerModal, setShowAddTrainerModal] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState<ITrainer | null>(null);
    const [trainerName, setTrainerName] = useState('');
    const [newTrainerName, setNewTrainerName] = useState('');
    const [duplicateTrainerMessage, setDuplicateTrainerMessage] = useState('');

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

    const handleSaveTrainerName = async () => {
        if (selectedTrainer && selectedTrainer._id && trainerName) {
            try {
                await editTrainer(selectedTrainer._id, trainerName);
                setShowEditTrainerModal(false);
                setSelectedTrainer(null);
            } catch (error) {
                console.error('Error updating trainer:', error);
            }
        }
    };

    const handleConfirmDeleteTrainer = async () => {
        if (selectedTrainer && selectedTrainer._id) {
            try {
                await deleteTrainerInDataContext(selectedTrainer._id);
                setShowDeleteTrainerModal(false);
                setSelectedTrainer(null);
            } catch (error) {
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
        <div>
            <Row className="">
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
                                <FontAwesomeIcon 
                                    icon={faPen}
                                    className="me-2"
                                    onClick={() => handleEditTrainerClick(trainer)}
                                    style={{ cursor: 'pointer', color: 'orange', border: '1px solid orange', borderRadius: '4px', padding: '2px' }}
                                />
                                <FontAwesomeIcon
                                 icon={faTrash}
                                 className='me-2'
                                  onClick={() => handleDeleteTrainerClick(trainer)}
                                  style={{ cursor: 'pointer', color: 'red', border: '1px solid red', borderRadius: '4px', padding: '2px' }}

                                   />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

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

export default AdminTrainer;