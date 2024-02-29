import React, { useEffect, useRef, useState, useCallback } from 'react';
import apiClient from '../services/api-client';
import { Button, Card, Col, Form, Modal, Row } from 'react-bootstrap';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { event } from 'jquery';
import { set } from 'react-hook-form';

// interface Course {
//   _id: string;
//   name: string;
//   owner: string;
//   owner_name: string;
//   description: string;
//   Count: number;
//   videoUrl: string;
// }
interface Form {
    courseName: string;
    description: string;
    vidSrc: File | null;
    }
interface ChildProps {
  sendDataToParent: (data: Form) => void;
  showFormFromParent: boolean;

}

const NewCourseForm: React.FC<ChildProps> = ({ sendDataToParent , showFormFromParent}): React.ReactNode => {
    const fileInputRef = useRef<HTMLInputElement>(null); // useRef for the file input
const [showForm, setShowForm] = useState(showFormFromParent);

  const [isButtonGreen, setIsButtonGreen] = useState(false);
  const [vidSrc, setvidSrc] = useState<File>();
  const [booleanRandom, setBooleanRandom] = useState<boolean>(false);
  const [vidError, setvidError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('name'); // Default selected option
  const [selectedVideoName, setSelectedVideoName] = useState<string>('');
const [courseName, setSelectedCourseName] = useState<string>('');
const [newFormSubmit, setFormSubmit] = useState<Form>({
    courseName: '',
    description: '',
    vidSrc: null,
});
const selectvid = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
};
useEffect(() => {
    setShowForm(showFormFromParent); // Update showForm when showFormFromParent changes
  }, [showFormFromParent]);
  const vidSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime']; // Add more video types if needed
      if (allowedTypes.includes(file.type)) {
        setvidSrc(file);
        setBooleanRandom(false);
        setvidError(''); // Clear any previous error message
        setSelectedVideoName(file.name); // Set the name of the selected video
        setIsButtonGreen(true); // Set the button color to green
        setFormSubmit((prevState) => ({ ...prevState, vidSrc: file }));
      } else {
        setvidError('Please select a valid video file (MP4, WebM, QuickTime).');
      }
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    sendDataToParent(newFormSubmit);
    setShowForm(false);
  };

  return (
    <Modal show={showForm} onHide={() => setShowForm(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCourseName" className="p-2">
            <Form.Label>Course Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter course name"
              value={newFormSubmit.courseName}
              onChange={(e) => setFormSubmit((prevState) => ({ ...prevState, courseName: e.target.value }))}
            />
          </Form.Group>
          <Form.Group controlId="formDescription" className="p-2">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter course description"
              value={newFormSubmit.description}
              onChange={(e) => setFormSubmit((prevState) => ({ ...prevState, description: e.target.value }))}
            />
          </Form.Group>
          <Form.Group controlId="formVideoUrl" className="p-2">
            <Form.Label>Video File</Form.Label>

            <Button
              type="button"
              className={`btn ${isButtonGreen ? 'btn-success' : 'btn-primary'}`} // Dynamically set button color
              onClick={selectvid}
            >
              {selectedVideoName ? `Selected: ${selectedVideoName}` : 'Upload Video'}
            </Button>
            <input style={{ display: 'none' }} ref={fileInputRef} type="file" onChange={vidSelected}></input>
            {vidError && <p className="text-danger">{vidError}</p>}
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default NewCourseForm;
