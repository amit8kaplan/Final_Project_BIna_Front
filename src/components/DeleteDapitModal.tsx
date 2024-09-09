import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Dapit } from '../pages/view';

interface AddCommentsModalProps {
  dapit: Dapit | undefined;
  onClose: () => void;
  onDelete: (id: string, idInstractor:string) => void;
}

const DeleteDapitModal: React.FC<AddCommentsModalProps> = ({ dapit, onClose, onDelete }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (dapit && dapit._id && dapit._id.length > 0) {
      setShow(true);
    } else {
      onClose();
    }
  }, [dapit]);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const handleDelete = () => {
    console.log("delete dapit: ", dapit);
    onDelete(dapit?._id!, dapit?.idInstractor!);
    setShow(false);
  };

  return (
<Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-danger">Delete Dapit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">Are you sure you want to delete this Dapit?</p>
        {dapit && (
          <div className="bg-light p-3 rounded">
            <Row className="mb-2">
              <Col><strong>Trainer Name:</strong></Col>
              <Col>{dapit.nameTrainer}</Col>
            </Row>
            <Row className="mb-2">
              <Col><strong>Instructor Name:</strong></Col>
              <Col>{dapit.nameInstractor}</Col>
            </Row>
            <Row className="mb-2">
              <Col><strong>Session:</strong></Col>
              <Col>{dapit.session}</Col>
            </Row>
            <Row className="mb-2">
              <Col><strong>Silabus:</strong></Col>
              <Col>{dapit.silabus}</Col>
            </Row>
            <Row className="mb-2">
              <Col><strong>Final Grade:</strong></Col>
              <Col>{dapit.finalGrade}</Col>
            </Row>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteDapitModal;