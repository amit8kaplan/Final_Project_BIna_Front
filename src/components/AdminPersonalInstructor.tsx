import React, { useState } from 'react';
import { Button, Row, Col, Table, Modal, Form } from 'react-bootstrap';
import { IPersonalInstractor, IInstractor, ITrainer } from '../public/interfaces';
import { useDataContext } from '../DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons';
import Papa from 'papaparse';

const AdminPersonalInstructor: React.FC = () => {
    const { personalInstractors, instructors, trainers, addPersonalInstructorFromCSV, addPersonalInstructor, editPersonalInstructor, deletePersonalInstructor } = useDataContext();
    const personalInstructorsComp = personalInstractors || [];
    const instructorsComp = instructors || [];
    const trainersComp = trainers || [];

    const [showAddPersonalInstructorModal, setShowAddPersonalInstructorModal] = useState(false);
    const [showEditPersonalInstructorModal, setShowEditPersonalInstructorModal] = useState(false);
    const [showDeletePersonalInstructorModal, setShowDeletePersonalInstructorModal] = useState(false);
    const [selectedPersonalInstructor, setSelectedPersonalInstructor] = useState<IPersonalInstractor | null>(null);
    const [selectedInstructorId, setSelectedInstructorId] = useState('');
    const [selectedTrainerId, setSelectedTrainerId] = useState('');
    const [trainerErrorMessage, setTrainerErrorMessage] = useState('');

    const handleAddPersonalInstructorClick = () => {
        setShowAddPersonalInstructorModal(true);
    };

    const handleEditPersonalInstructorClick = (personalInstructor: IPersonalInstractor) => {
        setSelectedPersonalInstructor(personalInstructor);
        setSelectedInstructorId(personalInstructor.idInstractor);
        setSelectedTrainerId(personalInstructor.idTrainer);
        setShowEditPersonalInstructorModal(true);
    };

    const handleDeletePersonalInstructorClick = (personalInstructor: IPersonalInstractor) => {
        setSelectedPersonalInstructor(personalInstructor);
        setShowDeletePersonalInstructorModal(true);
    };

    const handleCloseAddPersonalInstructorModal = () => {
        setShowAddPersonalInstructorModal(false);
        setSelectedInstructorId('');
        setSelectedTrainerId('');
        setTrainerErrorMessage('');
    };

    const handleCloseEditPersonalInstructorModal = () => {
        setShowEditPersonalInstructorModal(false);
        setSelectedPersonalInstructor(null);
        setTrainerErrorMessage('');
    };

    const handleCloseDeletePersonalInstructorModal = () => {
        setShowDeletePersonalInstructorModal(false);
        setSelectedPersonalInstructor(null);
    };

    const handleInstructorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedInstructorId(e.target.value);
    };

    const handleTrainerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const trainerId = e.target.value;
        setSelectedTrainerId(trainerId);

        const existingPersonalInstructor = personalInstructorsComp.find(personalInstructor => personalInstructor.idTrainer === trainerId);
        if (existingPersonalInstructor) {
            const instructorName = getInstructorName(existingPersonalInstructor.idInstractor);
            setTrainerErrorMessage(`This trainer already has an assigned instructor: ${instructorName}.`);
        } else {
            setTrainerErrorMessage('');
        }
    };

    const handleSavePersonalInstructor = async () => {
        if (selectedPersonalInstructor && selectedPersonalInstructor._id&& selectedInstructorId && selectedTrainerId && !trainerErrorMessage) {
            //console.log ("handleSavePersonalInstructor", selectedPersonalInstructor._id, selectedInstructorId, selectedTrainerId);
            try {
                await editPersonalInstructor(
                    selectedPersonalInstructor._id,
                    selectedInstructorId,
                    selectedTrainerId
                );
                setShowEditPersonalInstructorModal(false);
                setSelectedPersonalInstructor(null);
            } catch (error) {
                console.error('Error updating personal instructor:', error);
            }
        }
    };

    const handleConfirmDeletePersonalInstructor = async () => {
        //console.log ("handleConfirmDeletePersonalInstructor", selectedPersonalInstructor);
        if (selectedPersonalInstructor&& selectedPersonalInstructor._id && selectedPersonalInstructor.idInstractor) {
            try {
                await deletePersonalInstructor(selectedPersonalInstructor._id);
                setShowDeletePersonalInstructorModal(false);
                setSelectedPersonalInstructor(null);
                //console.log ("handleConfirmDeletePersonalInstructor", selectedPersonalInstructor);
            } catch (error) {
                console.error('handleConfirmDeletePersonalInstructor Error deleting personal instructor:', error);
            }
        }
    };

    const handleAddNewPersonalInstructor = async () => {
        if (selectedInstructorId && selectedTrainerId && !trainerErrorMessage) {
            try {
                await addPersonalInstructor(
                    selectedInstructorId,
                    selectedTrainerId
                );
                setShowAddPersonalInstructorModal(false);
                setSelectedInstructorId('');
                setSelectedTrainerId('');
            } catch (error) {
                console.error('Error adding personal instructor:', error);
            }
        }
    };

    const getInstructorName = (id: string) => {
        const instructor = instructorsComp.find(instructor => instructor._id === id);
        return instructor ? instructor.name : 'Unknown';
    };

    const getTrainerName = (id: string) => {
        const trainer = trainersComp.find(trainer => trainer._id === id);
        return trainer ? trainer.name : 'Unknown';
    };
    const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        const file = fileInput.files?.[0];
        if (file) {
            //console.log('Importing trainers from CSV:', file.name);
            Papa.parse(file, {
                header: true,
                complete: async (results) => {
                    const PICSV: IPersonalInstractor[] = results.data;
                    //console.log('Trainers from CSV:', PICSV);
                    for (const pi of PICSV) {
                        if (pi.idTrainer) {
                            //console.log('Adding trainer from CSV:', pi);
                            try {
                                if (pi._id) {
                                    //console.log('Adding trainer from CSV with ID:', pi._id);
                                    await addPersonalInstructorFromCSV(pi._id, pi.idInstractor, pi.idTrainer);
                                } else {
                                    //console.log('Adding trainer from CSV without ID:', pi.idInstractor, pi.idTrainer);
                                    await addPersonalInstructor(pi.idInstractor, pi.idTrainer);
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
                    <h4>Personal Ins {personalInstructorsComp.length}</h4>
                </Col>
                <Col className="text-end">
                    <FontAwesomeIcon 
                        icon={faPlus} 
                        className='me-1'
                        style={{ cursor: 'pointer', color: 'green'}}
                        onClick={handleAddPersonalInstructorClick}
                     />
                     <label htmlFor="import-personal-Instractor-csv">
                        <FontAwesomeIcon
                         icon={faFileImport}
                         className='me-1'
                         style={{ cursor: 'pointer', color: 'blue', marginLeft: '10px' }}
                          />
                    </label>
                    <input
                        type="file"
                        id="import-personal-Instractor-csv"
                        accept=".csv"
                        style={{ display: 'none' }}
                        onChange={handleImportCSV}
                    />
                </Col>
            </Row>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Instructor Name</th>
                        <th>Trainer Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {personalInstructorsComp.map((personalInstructor, index) => (
                        <tr key={index}>
                            <td>{getInstructorName(personalInstructor.idInstractor)}</td>
                            <td>{getTrainerName(personalInstructor.idTrainer)}</td>
                            <td>
                                <FontAwesomeIcon 
                                    icon={faPen} 
                                    className="me-2" 
                                    style={{ cursor: 'pointer', color: 'orange', border: '1px solid orange', borderRadius: '4px', padding: '2px' }}
                                    onClick={() => handleEditPersonalInstructorClick(personalInstructor)}
                                />
                                <FontAwesomeIcon 
                                    icon={faTrash} 
                                    style={{ cursor: 'pointer', color: 'red', border: '1px solid red', borderRadius: '4px', padding: '2px' }}
                                    onClick={() => handleDeletePersonalInstructorClick(personalInstructor)}
                                    className='ms-2'
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showAddPersonalInstructorModal} onHide={handleCloseAddPersonalInstructorModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Personal Instructor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formInstructorSelect">
                            <Form.Label>Instructor</Form.Label>
                            <Form.Control as="select" value={selectedInstructorId} onChange={handleInstructorChange}>
                                <option value="">Select Instructor</option>
                                {instructorsComp.map(instructor => (
                                    <option key={instructor._id} value={instructor._id}>{instructor.name}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formTrainerSelect">
                            <Form.Label>Trainer</Form.Label>
                            <Form.Control as="select" value={selectedTrainerId} onChange={handleTrainerChange}>
                                <option value="">Select Trainer</option>
                                {trainersComp.map(trainer => (
                                    <option key={trainer._id} value={trainer._id}>{trainer.name}</option>
                                ))}
                            </Form.Control>
                            {trainerErrorMessage && (
                                <Form.Text className="text-danger">
                                    {trainerErrorMessage}
                                </Form.Text>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddPersonalInstructorModal}>Close</Button>
                    <Button variant="primary" onClick={handleAddNewPersonalInstructor} disabled={!!trainerErrorMessage}>Add Personal Instructor</Button>
                </Modal.Footer>
            </Modal>

            {selectedPersonalInstructor && (
                <Modal show={showEditPersonalInstructorModal} onHide={handleCloseEditPersonalInstructorModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Personal Instructor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formInstructorSelect">
                                <Form.Label>Instructor</Form.Label>
                                <Form.Control as="select" value={selectedInstructorId} onChange={handleInstructorChange}>
                                    <option value="">Select Instructor</option>
                                    {instructorsComp.map(instructor => (
                                        <option key={instructor._id} value={instructor._id}>{instructor.name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formTrainerSelect">
                                <Form.Label>Trainer</Form.Label>
                                <Form.Control as="select" value={selectedTrainerId} onChange={handleTrainerChange}>
                                    <option value="">Select Trainer</option>
                                    {trainersComp.map(trainer => (
                                        <option key={trainer._id} value={trainer._id}>{trainer.name}</option>
                                    ))}
                                </Form.Control>
                                {trainerErrorMessage && (
                                    <Form.Text className="text-danger">
                                        {trainerErrorMessage}
                                    </Form.Text>
                                )}
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEditPersonalInstructorModal}>Close</Button>
                        <Button variant="primary" onClick={handleSavePersonalInstructor} disabled={!!trainerErrorMessage}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            )}

            {selectedPersonalInstructor && (
                <Modal show={showDeletePersonalInstructorModal} onHide={handleCloseDeletePersonalInstructorModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Personal Instructor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete this personal instructor?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeletePersonalInstructorModal}>Close</Button>
                        <Button variant="danger" onClick={handleConfirmDeletePersonalInstructor}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default AdminPersonalInstructor;