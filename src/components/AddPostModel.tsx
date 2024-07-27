import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface AddPostModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (title: string, text: string, instractorName: string) => void;
}

const AddPostModal: React.FC<AddPostModalProps> = ({ show, handleClose, handleSave }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [instractorName, setInstractorName] = useState('');
  const handleSubmit = () => {
    handleSave(title, text,instractorName);
   Close()
  };
  const Close = () => {
    setTitle('');
    setInstractorName('');
    setText('');
    setFile(null);
    handleClose();
  }
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Assert that event.target is an HTMLInputElement
    const input = event.target as HTMLInputElement;
  
    // Now you can safely access the files property
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      setFile(file)
    }
  };
  return (
    <Modal show={show} onHide={Close}>
      <Modal.Header closeButton>
        <Modal.Title>Add a Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Enter title" value={title} onChange={e => setTitle(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formInstractorName">
            <Form.Label>Instractor Name</Form.Label>
            <Form.Control type="text" placeholder="Enter Ins Name" value={instractorName} onChange={e => setInstractorName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formText">
            <Form.Label>Text</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Enter text" value={text} onChange={e => setText(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="formFile">
            <Form.Label>File</Form.Label>
            <input type="file" onChange={handleFileChange} />
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

export default AddPostModal;
