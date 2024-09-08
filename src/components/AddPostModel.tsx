import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDataContext } from '../DataContext';
import { IInstractor } from '../public/interfaces';
interface AddPostModalProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (title: string, text: string, instractorID: string,instractorName:string, file:File|null) => void;
}

const AddPostModal: React.FC<AddPostModalProps> = ({ show, handleClose, handleSave }) => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [instractorID, setInstractorID] = useState<string>();
  const [instractorName, setInstractorName] = useState<string>();
  const { instructors,} =  useDataContext();
  const InstractorsComp = instructors || [];
  const handleChageInsName = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    setInstractorName(target.value);
    const selectedOption = target.selectedOptions[0];
    const instID = selectedOption ? selectedOption.getAttribute('data-id') : '0';
    setInstractorID(instID);
  }
  const handleSubmit = () => {
    if (instractorID && instractorName){
      handleSave(title, text,instractorID, instractorName, file);
    }else {
      handleSave(title,text, "","", file )
    }
    Close()
  };
  const Close = () => {
    setTitle('');
    setInstractorID('')
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
            <Form.Control as="select" value={instractorName} 
            onChange={(e) => handleChageInsName(e)}>
                <option value="">Select Instractor</option>
                {InstractorsComp.map((Instractor, idx) => (
                  <option key={Instractor._id!} value={Instractor.name} data-id={Instractor._id!}>
                    {Instractor.name}
                  </option>
                ))}
              </Form.Control>          </Form.Group>
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
