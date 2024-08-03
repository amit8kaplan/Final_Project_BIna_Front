import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface AddCommentsModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (personalName: string, content: string) => void;
}

const AddCommnetModal: React.FC<AddCommentsModalProps> = ({ show, handleClose, handleSave }) => {

    const [personalName, setPersonalName] = useState('');
    const [content, setContent] = useState('');
    const handleSubmit = () => {
        handleSave(personalName, content);
    Close()
    };
  const Close = () => {
    setPersonalName('');
    setContent('');
    handleClose();
  }

  return (
    <Modal show={show} onHide={Close}>
      <Modal.Header closeButton>
        <Modal.Title>Add a Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Instractor Name</Form.Label>
            <Form.Control type="text" placeholder="Enter youre name" value={personalName} onChange={e => setPersonalName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formInstractorName">
            <Form.Label>Content</Form.Label>
            <Form.Control type="text" placeholder="fill the content" value={content} onChange={e => setContent(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Close</Button>
        <Button variant="primary" onClick={handleSubmit}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddCommnetModal;
