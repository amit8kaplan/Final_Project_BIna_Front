import React, { useState } from 'react';
import { Button, Row, Col, Table, Modal, Form } from 'react-bootstrap';
import { IInstractor } from '../public/interfaces';
import { useDataContext } from '../DataContext';

const AdminInstructor: React.FC = () => {
    const { instructors, addInstractor, editInstractor, deleteInstractorInDataContext } = useDataContext();
    const instructorsComp = instructors || [];

    const [showAddInstructorModal, setShowAddInstructorModal] = useState(false);
    const [showEditInstructorModal, setShowEditInstructorModal] = useState(false);
    const [showDeleteInstructorModal, setShowDeleteInstructorModal] = useState(false);
    const [selectedInstructor, setSelectedInstructor] = useState<IInstractor | null>(null);
    const [instructorName, setInstructorName] = useState('');
    const [newInstructorName, setNewInstructorName] = useState('');
    const [duplicateInstructorMessage, setDuplicateInstructorMessage] = useState('');
    const [newInstructorMail, setNewInstructorMail] = useState('');
    const [newInstructorPermission, setNewInstructorPermission] = useState('regular');

    const handleAddInstructorClick = () => {
        setShowAddInstructorModal(true);
    };

    const handleEditInstructorClick = (instructor: IInstractor) => {
        setSelectedInstructor(instructor);
        setInstructorName(instructor.name);
        setNewInstructorMail(instructor.email);
        setNewInstructorPermission(instructor.permissions);
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

    return (
        <div>
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
                            <td>{instructor.name}</td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditInstructorClick(instructor)}>Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteInstructorClick(instructor)}>Delete</Button>
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