import React, { useState } from 'react';
import { Button, Row, Col, Table, Modal, Form } from 'react-bootstrap';
import { IInstractor } from '../public/interfaces';
import { useDataContext } from '../DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash, faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons';
import Papa from 'papaparse';

const AdminInstructor: React.FC = () => {
    const { instructors, addInstractorFromCSV, addInstractor, editInstractor, deleteInstractorInDataContext } = useDataContext();
    const instructorsComp = instructors || [];

    const [showAddInstructorModal, setShowAddInstructorModal] = useState(false);
    const [showEditInstructorModal, setShowEditInstructorModal] = useState(false);
    const [showDeleteInstructorModal, setShowDeleteInstructorModal] = useState(false);
    const [showInstructorModal, setShowInstructorModal] = useState(false); // New state for showing instructor modal
    const [selectedInstructor, setSelectedInstructor] = useState<IInstractor | null>(null);
    const [instructorName, setInstructorName] = useState('');
    const [newInstructorName, setNewInstructorName] = useState('');
    const [duplicateInstructorMessage, setDuplicateInstructorMessage] = useState('');
    const [newInstructorMail, setNewInstructorMail] = useState('');
    const [newInstructorPermission, setNewInstructorPermission] = useState('regular');

    const handleAddInstructorClick = () => {
        setShowAddInstructorModal(true);
    };

    const handleInstructorClick = (instructor: IInstractor) => {
        setSelectedInstructor(instructor);
        setShowInstructorModal(true);
    };

    const handleEditInstructorClick = (instructor: IInstractor) => {
        setSelectedInstructor(instructor);
        setInstructorName(instructor.name);
        setNewInstructorMail(instructor.email);
        setNewInstructorPermission(instructor.permissions || 'regular');
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
        setNewInstructorMail('');
        setNewInstructorPermission('regular');
    };

    const handleCloseInstructorModal = () => {
        setShowInstructorModal(false);
        setSelectedInstructor(null);
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

    const handleNewInstructorMailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewInstructorMail(e.target.value);
    };

    const handleNewInstructorPermissionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewInstructorPermission(e.target.value);
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

    const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileInput = event.target;
        const file = fileInput.files?.[0];
        if (file) {
            //console.log('Importing instructors from CSV:', file.name);
            Papa.parse(file, {
                header: true,
                complete: async (results) => {
                    const instructorCSV: IInstractor[] = results.data;
                    //console.log('Instructors from CSV:', instructorCSV);
                    for (const instructor of instructorCSV) {
                        if (instructor.name) {
                            //console.log('Adding instructor from CSV:', instructor);
                            try {
                                if (instructor._id) {
                                    //console.log('Adding instructor from CSV with ID:', instructor._id);
                                    await addInstractorFromCSV(instructor._id, instructor.name, instructor.email, instructor.permissions || 'regular');
                                } else {
                                    //console.log('Adding instructor from CSV without ID:', instructor.name);
                                    await addInstractor(instructor.name, instructor.email, instructor.permissions || 'regular');
                                }
                            } catch (error) {
                                console.error('Error adding instructor from CSV:', error);
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
                    <h4>Instructors {instructorsComp.length}</h4>
                </Col>
                <Col className="text-end">
                    <FontAwesomeIcon 
                    icon={faPlus} 
                    className='me-1'
                    onClick={handleAddInstructorClick} 
                    style={{ cursor: 'pointer', color:'green' }} />
                    <label htmlFor="import-instructor-csv">
                        <FontAwesomeIcon
                         icon={faFileImport}
                         className='me-1'
                         style={{ cursor: 'pointer', color: 'blue', marginLeft: '10px' }}
                          />
                    </label>
                    <input
                        type="file"
                        id="import-instructor-csv"
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
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {instructorsComp.map((instructor, index) => (
                        <tr key={index}>
                            <td onClick={() => handleInstructorClick(instructor)}>{instructor.name}</td>
                            <td>
                                <FontAwesomeIcon
                                 icon={faPen} 
                                 className="me-2" 
                                 onClick={() => handleEditInstructorClick(instructor)}
                                 style={{ cursor: 'pointer', color: 'orange', border: '1px solid orange', borderRadius: '4px', padding: '2px' }}
                                />
                                <FontAwesomeIcon
                                 icon={faTrash} 
                                 className='me-2'
                                 onClick={() => handleDeleteInstructorClick(instructor)}
                                 style={{ cursor: 'pointer', color: 'red', border: '1px solid red', borderRadius: '4px', padding: '2px' }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

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
                <Modal show={showInstructorModal} onHide={handleCloseInstructorModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedInstructor.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Instructor ID: {selectedInstructor._id}</p>
                        <p>Instructor Name: {selectedInstructor.name}</p>
                        <p>Instructor Email: {selectedInstructor.email}</p>
                        <p>Instructor Permission: {selectedInstructor.permissions}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseInstructorModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}

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
                                    type="email"
                                    value={newInstructorMail}
                                    onChange={handleNewInstructorMailChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid email address.
                                </Form.Control.Feedback>
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

export default AdminInstructor;