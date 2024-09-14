import React, { useState, useEffect } from 'react';
import useSessionStorage from '../hooks/useSessionStorage';
import { useDataContext } from '../DataContext';
import { Button, Row, Col, Table, Modal, Form } from 'react-bootstrap';
import { IInstractor, ITrainer } from '../public/interfaces';

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

    const [showTrainerModal, setShowTrainerModal] = useState(false);
    const [showEditTrainerModal, setShowEditTrainerModal] = useState(false);
    const [showDeleteTrainerModal, setShowDeleteTrainerModal] = useState(false);
    const [showAddTrainerModal, setShowAddTrainerModal] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState<ITrainer | null>(null);
    const [trainerName, setTrainerName] = useState('');
    const [newTrainerName, setNewTrainerName] = useState('');
    const [duplicateTrainerMessage, setDuplicateTrainerMessage] = useState('');
    const [showAddInstructorModal, setShowAddInstructorModal] = useState(false);
    const [showEditInstructorModal, setShowEditInstructorModal] = useState(false);
    const [showDeleteInstructorModal, setShowDeleteInstructorModal] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState<IInstractor | null>(null);
    const [instructorName, setInstructorName] = useState('');
    const [newInstructorName, setNewInstructorName] = useState('');
    const [duplicateInstructorMessage, setDuplicateInstructorMessage] = useState('');
    const [newInstructorMail, setNewInstructorMail] = useState('');
    const [newInstructorPermission, setNewInstructorPermission] = useState('regular');
    const [showInstructorModal, setShowInstructorModal] = useState(false);
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

    const handleSaveTrainerName =async () => {
        if (selectedTrainer && selectedTrainer._id && trainerName) {
            // Update the trainer's name (this should ideally be done via an API call)
            try{
                await editTrainer(selectedTrainer._id,trainerName);
                setShowEditTrainerModal(false);
                setSelectedTrainer(null);
            }catch(error){
                console.error('Error updating trainer:', error);
                
            }
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
    /**
     * Instructor Functions
     */
    const handleInstractorClick = (instructor: IInstractor) => {
        setSelectedInstructor(instructor);
        console.log("handleInstractorClick",instructor);
        setShowInstructorModal(true);
    }
    const handleAddInstructorClick = () => {
        setShowAddInstructorModal(true);
    };
    
    const handleEditInstructorClick = (instructor: IInstractor) => {
        setSelectedInstructor(instructor);
        setInstructorName(instructor.name);
        setShowEditInstructorModal(true);
    };
    
    const handleDeleteInstructorClick = (instructor: IInstractor) => {
        setSelectedInstructor(instructor);
        setShowDeleteInstructorModal(true);
    };
    
    const handleCloseAddInstructorModal = () => {
        setShowAddInstructorModal(false);
        setNewInstructorName('');
        setDuplicateInstructorMessage('');
    };
    
    const handleCloseEditInstructorModal = () => {
        setShowEditInstructorModal(false);
        setSelectedInstructor(null);
    };
    
    const handleCloseDeleteInstructorModal = () => {
        setShowDeleteInstructorModal(false);
        setSelectedInstructor(null);
    };
    
    const handleInstructorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInstructorName(e.target.value);
    };
    
    const handleNewInstructorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const instructorName = e.target.value;
        setNewInstructorName(instructorName);
    
        const duplicateInstructor = instructorsComp.find(instructor => instructor.name.toLowerCase() === instructorName.toLowerCase());
        if (duplicateInstructor) {
            setDuplicateInstructorMessage('An instructor with this name already exists.');
        } else {
            setDuplicateInstructorMessage('');
        }
    };
    
    const handleSaveInstructorName = async () => {
        if (selectedInstructor && selectedInstructor._id && instructorName && newInstructorMail && newInstructorPermission) {
            try {
                await editInstractor(
                    selectedInstructor._id,
                    instructorName,
                    newInstructorMail,
                    newInstructorPermission
                );
                setShowEditInstructorModal(false);
                setSelectedInstructor(null);
            } catch (error) {
                console.error('Error updating instructor:', error);
            }
        }
    };
    const handleConfirmDeleteInstructor = async () => {
        if (selectedInstructor && selectedInstructor._id) {
            try {
                await deleteInstractorInDataContext(selectedInstructor._id);
                setShowDeleteInstructorModal(false);
                setSelectedInstructor(null);
            } catch (error) {
                console.error('Error deleting instructor:', error);
            }
        }
    };
    const handleNewInstructorMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewInstructorMail(e.target.value);
    };
    
    const handleNewInstructorPermissionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewInstructorPermission(e.target.value);
    };
    const handleAddNewInstructor = async () => {
        if (newInstructorName && !duplicateInstructorMessage) {
            try {
                await addInstractor(
                     newInstructorName,
                     newInstructorMail,
                     newInstructorPermission
                );
                setShowAddInstructorModal(false);
                setNewInstructorName('');
                setNewInstructorMail('');
                setNewInstructorPermission('regular');
            } catch (error) {
                console.error('Error adding instructor:', error);
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

                        

                       {/* Instructors Section */}
                        <Col>
                            <Row>
                                <Col>
                                    <h4>Instructors {instructorsComp.length}</h4>
                                </Col>
                                <Col className="text-end">
                                    <Button variant="success" size="sm" className="me-1" onClick={handleAddInstructorClick}>Add</Button>
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
                                    {instructorsComp.map((instructor, index) => (
                                        <tr key={index}>
                                            <td onClick={() => handleInstractorClick(instructor)}>{instructor.name}</td>
                                            <td>
                                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditInstructorClick(instructor)}>Edit</Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteInstructorClick(instructor)}>Delete</Button>
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
            {selectedInstructor && (
                <Modal show={showInstructorModal} onHide={handleCloseEditInstructorModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedInstructor.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Instructor ID: {selectedInstructor._id}</p>
                        <p>Instructor Name: {selectedInstructor.name}</p>
                        <p>Instructor Mail: {selectedInstructor.email}</p>
                        <p>Instructor Permission: {selectedInstructor.permissions}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEditInstructorModal}>Close</Button>
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
            <Modal show={showAddInstructorModal} onHide={handleCloseAddInstructorModal}>
    <Modal.Header closeButton>
        <Modal.Title>Add Instructor</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        <Form>
            <Form.Group controlId="formNewInstructorName">
                <Form.Label>Instructor Name</Form.Label>
                <Form.Control
                    type="text"
                    value={newInstructorName}
                    onChange={handleNewInstructorNameChange}
                />
                {duplicateInstructorMessage && (
                    <Form.Text className="text-danger">
                        {duplicateInstructorMessage}
                    </Form.Text>
                )}
            </Form.Group>
            <Form.Group controlId="formNewInstructorMail">
                <Form.Label>Mail</Form.Label>
                <Form.Control
                    type="email"
                    value={newInstructorMail}
                    onChange={handleNewInstructorMailChange}
                    required
                />
                <Form.Control.Feedback type="invalid">
                    Please provide a valid email address.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formNewInstructorPermission">
                <Form.Label>Permission</Form.Label>
                <Form.Control
                    as="select"
                    value={newInstructorPermission}
                    onChange={handleNewInstructorPermissionChange}
                >
                    <option value="regular">Regular</option>
                    <option value="group">Group</option>
                    <option value="admin">Admin</option>
                </Form.Control>
            </Form.Group>
        </Form>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseAddInstructorModal}>Close</Button>
        <Button variant="primary" onClick={handleAddNewInstructor} disabled={!!duplicateInstructorMessage}>Add Instructor</Button>
    </Modal.Footer>
</Modal>

            {selectedInstructor && (
                <Modal show={showEditInstructorModal} onHide={handleCloseEditInstructorModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Instructor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formInstructorName">
                                <Form.Label>Instructor Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={instructorName}
                                    onChange={handleInstructorNameChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formInstructorMail">
                                <Form.Label>Mail</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={newInstructorMail}
                                    onChange={handleNewInstructorMailChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formInstructorPermission">
                                <Form.Label>Permission</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={newInstructorPermission}
                                    onChange={handleNewInstructorPermissionChange}
                                >
                                    <option value="regular">Regular</option>
                                    <option value="group">Group</option>
                                    <option value="admin">Admin</option>
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEditInstructorModal}>Close</Button>
                        <Button variant="primary" onClick={handleSaveInstructorName}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            )}

            {selectedInstructor && (
                <Modal show={showDeleteInstructorModal} onHide={handleCloseDeleteInstructorModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Instructor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete {selectedInstructor.name}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteInstructorModal}>Close</Button>
                        <Button variant="danger" onClick={handleConfirmDeleteInstructor}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default Administrator;