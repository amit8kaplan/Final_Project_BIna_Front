import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Table, Modal, Form } from 'react-bootstrap';
import { IGroup, ITrainer, IInstractor } from '../public/interfaces';
import { useDataContext } from '../DataContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash ,faPlus} from '@fortawesome/free-solid-svg-icons';
const AdminGroup: React.FC = () => {
    const { groups, trainers, instructors, addGroup, editGroup, deleteGroupInDataContext } = useDataContext();
    const groupsComp = groups || [];
    const trainersComp = trainers || [];
    const instructorsComp = instructors || [];

    const [showAddGroupModal, setShowAddGroupModal] = useState(false);
    const [showEditGroupModal, setShowEditGroupModal] = useState(false);
    const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<IGroup | null>(null);
    const [groupName, setGroupName] = useState('');
    const [selectedTrainers, setSelectedTrainers] = useState<string[]>([]);
    const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [trainersInGroup, setTrainersInGroup] = useState<ITrainer[]>([]);
    const [instructorsInGroup, setInstructorsInGroup] = useState<IInstractor[]>([]);
    const [trainerGroupMap, setTrainerGroupMap] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const map: { [key: string]: string } = {};
        
        groupsComp.forEach(group => {
            if (group.idsTrainers){
                group.idsTrainers.forEach(trainerId => {
                    map[trainerId] = group.name;
                });
            }
        });
        setTrainerGroupMap(map);
    }, [groupsComp]);

    const fetchTrainers = async (group: IGroup) => {
        const trainersInGroup = trainersComp.filter(trainer => group?.idsTrainers?.includes(trainer._id || ''));
        setTrainersInGroup(trainersInGroup);
    };

    const fetchInstructors = async (group: IGroup) => {
        const instructorsInGroup = instructorsComp.filter(instructor => group?.idsInstractors?.includes(instructor._id || ''));
        setInstructorsInGroup(instructorsInGroup);
    };

    const handleAddGroupClick = () => {
        setShowAddGroupModal(true);
    };

    const handleGroupClick = (group: IGroup) => {
        setSelectedGroup(group);
        fetchTrainers(group);
        fetchInstructors(group);
        setGroupName(group.name);
        setSelectedTrainers(group.idsTrainers || []);
        setSelectedInstructors(group.idsInstractors || []);
        setShowGroupModal(true);
    };

    const handleDeleteGroupClick = (group: IGroup) => {
        setSelectedGroup(group);
        fetchTrainers(group);
        fetchInstructors(group);
        setShowDeleteGroupModal(true);
    };

    const handleEditGroupClick = (group: IGroup) => {
        setSelectedGroup(group);
        fetchTrainers(group);
        fetchInstructors(group);
        setGroupName(group.name);
        setSelectedTrainers(group.idsTrainers || []);
        setSelectedInstructors(group.idsInstractors || []);
        setShowEditGroupModal(true);
    };

    const handleCloseAddGroupModal = () => {
        setShowAddGroupModal(false);
        setGroupName('');
        setSelectedTrainers([]);
        setSelectedInstructors([]);
    };

    const handleCloseEditGroupModal = () => {
        setShowEditGroupModal(false);
        setSelectedGroup(null);
        setGroupName('');
        setTrainersInGroup([]);
        setInstructorsInGroup([]);
        setSelectedTrainers([]);
        setSelectedInstructors([]);
    };

    const handleCloseGroupModal = () => {
        setShowGroupModal(false);
        setSelectedGroup(null);
        setTrainersInGroup([]);
        setInstructorsInGroup([]);
        setSelectedTrainers([]);
        setSelectedInstructors([]);
    };

    const handleCloseDeleteGroupModal = () => {
        setShowDeleteGroupModal(false);
        setSelectedGroup(null);
        setTrainersInGroup([]);
        setInstructorsInGroup([]);
        setSelectedTrainers([]);
        setSelectedInstructors([]);
    };

    const handleGroupNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGroupName(e.target.value);
    };

    const handleTrainerSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const trainerId = e.target.value;
        setSelectedTrainers(prevSelected =>
            e.target.checked
                ? [...prevSelected, trainerId]
                : prevSelected.filter(id => id !== trainerId)
        );
    };

    const handleInstructorSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const instructorId = e.target.value;
        setSelectedInstructors(prevSelected =>
            e.target.checked
                ? [...prevSelected, instructorId]
                : prevSelected.filter(id => id !== instructorId)
        );
    };

    const handleAddNewGroup = async () => {
        if (groupName) {
            try {
                await addGroup(
                     groupName,
                     selectedTrainers,
                     selectedInstructors
                );
                handleCloseAddGroupModal();
            } catch (error) {
                console.error('Error adding group:', error);
            }
        }
    };

    const handleSaveGroup = async () => {
        if (selectedGroup && selectedGroup._id && groupName) {
            try {
                await editGroup(selectedGroup._id, 
                     groupName,
                     selectedTrainers,
                     selectedInstructors
                );
                handleCloseEditGroupModal();
            } catch (error) {
                console.error('Error updating group:', error);
            }
        }
    };

    const handleConfirmDeleteGroup = async () => {
        if (selectedGroup && selectedGroup._id) {
            try {
                await deleteGroupInDataContext(selectedGroup._id);
                handleCloseDeleteGroupModal();
            } catch (error) {
                console.error('Error deleting group:', error);
            }
        }
    };

    return (
        <div>
            <Row>
                <Col>
                    <h4>Groups {groupsComp.length}</h4>
                </Col>
                <Col className="text-end">
                <FontAwesomeIcon 
                icon={faPlus} 
                onClick={handleAddGroupClick} 
                className='me-1'
                style={{ cursor: 'pointer', color: 'green' }} />
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
                    {groupsComp.map((group, index) => (
                        <tr key={index}>
                            <td onClick={() => handleGroupClick(group)}>{group.name}</td>
                            <td>
                            <FontAwesomeIcon
                                    icon={faPen}
                                    className="me-2"
                                    onClick={() => handleEditGroupClick(group)}
                                    style={{ cursor: 'pointer', color: 'orange', border: '1px solid orange', borderRadius: '4px', padding: '2px' }}
                                />
                                <FontAwesomeIcon
                                    icon={faTrash}
                                    className='me-2'
                                    onClick={() => handleDeleteGroupClick(group)}
                                    style={{ cursor: 'pointer', color: 'red', border: '1px solid red', borderRadius: '4px', padding: '2px' }}
                                />
                           </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <Modal show={showAddGroupModal} onHide={handleCloseAddGroupModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formGroupName">
                            <Form.Label>Group Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={groupName}
                                onChange={handleGroupNameChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formGroupTrainers">
                            <Form.Label>Trainers</Form.Label>
                            {trainersComp.map(trainer => (
                                <Row key={trainer._id}>
                                    <Col>
                                        <Form.Check
                                            type="checkbox"
                                            label={trainer.name}
                                            value={trainer._id}
                                            checked={selectedTrainers.includes(trainer._id)}
                                            onChange={handleTrainerSelectionChange}
                                            disabled={trainerGroupMap[trainer._id] !== undefined}
                                        />
                                    </Col>
                                    <Col>
                                        {trainerGroupMap[trainer._id] && (
                                            <span style={{ color: 'red' }}> (Assigned to {trainerGroupMap[trainer._id]})</span>
                                        )}
                                    </Col>
                                </Row>
                            ))}
                        </Form.Group>
                        <Form.Group controlId="formGroupInstructors">
                            <Form.Label>Instructors</Form.Label>
                            {instructorsComp.map(instructor => (
                                <Form.Check
                                    key={instructor._id}
                                    type="checkbox"
                                    label={instructor.name}
                                    value={instructor._id}
                                    checked={selectedInstructors.includes(instructor._id)}
                                    onChange={handleInstructorSelectionChange}
                                />
                            ))}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddGroupModal}>Close</Button>
                    <Button variant="primary" onClick={handleAddNewGroup}>Add Group</Button>
                </Modal.Footer>
            </Modal>

            {selectedGroup && (
                <Modal show={showGroupModal} onHide={handleCloseGroupModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>{selectedGroup.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Group ID: {selectedGroup._id}</p>
                        <p>Group Name: {selectedGroup.name}</p>
                        <p>Trainers: {trainersInGroup.map(trainer => trainer.name).join(', ')}</p>
                        <p>Instructors: {instructorsInGroup.map(ins => ins.name).join(', ')}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseGroupModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            )}

            {selectedGroup && (
                <Modal show={showEditGroupModal} onHide={handleCloseEditGroupModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>Group Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={groupName}
                                    onChange={handleGroupNameChange}
                                />
                            </Form.Group>
                            <Form.Group controlId="formGroupTrainers">
                                <Form.Label>Trainers</Form.Label>
                                {trainersComp.map(trainer => (
                                    <Row key={trainer._id}>
                                        <Col>
                                            <Form.Check
                                                type="checkbox"
                                                label={trainer.name}
                                                value={trainer._id}
                                                checked={selectedTrainers.includes(trainer._id)}
                                                onChange={handleTrainerSelectionChange}
                                                disabled={trainerGroupMap[trainer._id] && trainerGroupMap[trainer._id] !== selectedGroup.name}
                                            />
                                        </Col>
                                        <Col>
                                            {trainerGroupMap[trainer._id] && trainerGroupMap[trainer._id] !== selectedGroup.name && (
                                                <span style={{ color: 'red' }}> (Assigned to {trainerGroupMap[trainer._id]})</span>
                                            )}
                                        </Col>
                                    </Row>
                                ))}
                            </Form.Group>
                            <Form.Group controlId="formGroupInstructors">
                                <Form.Label>Instructors</Form.Label>
                                {instructorsComp.map(instructor => (
                                    <Form.Check
                                        key={instructor._id}
                                        type="checkbox"
                                        label={instructor.name}
                                        value={instructor._id}
                                        checked={selectedInstructors.includes(instructor._id)}
                                        onChange={handleInstructorSelectionChange}
                                    />
                                ))}
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseEditGroupModal}>Close</Button>
                        <Button variant="primary" onClick={handleSaveGroup}>Save Changes</Button>
                    </Modal.Footer>
                </Modal>
            )}

            {selectedGroup && (
                <Modal show={showDeleteGroupModal} onHide={handleCloseDeleteGroupModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Are you sure you want to delete {selectedGroup.name}?</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseDeleteGroupModal}>Close</Button>
                        <Button variant="danger" onClick={handleConfirmDeleteGroup}>Delete</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

export default AdminGroup;