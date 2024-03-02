
import React, { useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

interface Form {
    courseName: string;
    description: string;
    vidSrc: File | null;
}

interface ChildProps {
    sendDatatoParentFromNewCourseForm: (data: Form) => void;
    showForm: boolean;
    showFormFromParent: (data: boolean) => void;
}

const NewCourseForm: React.FC<ChildProps> = ({ sendDatatoParentFromNewCourseForm, showForm, showFormFromParent }): React.ReactNode => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isButtonGreen, setIsButtonGreen] = useState(false);
    const [vidSrc, setVidSrc] = useState<File | null>(null);
    const [vidError, setVidError] = useState<string>('');
    const [selectedVideoName, setSelectedVideoName] = useState<string>('');
    const [newFormSubmit, setFormSubmit] = useState<Form>({
        courseName: '',
        description: '',
        vidSrc: null,
    });
    
    const selectVideo = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleVideoSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
            if (allowedTypes.includes(file.type)) {
                setVidSrc(file);
                setVidError('');
                setSelectedVideoName(file.name);
                setIsButtonGreen(true);
                setFormSubmit(prevState => ({ ...prevState, vidSrc: file }));
            } else {
                setVidError('Please select a valid video file (MP4, WebM, QuickTime).');
            }
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendDatatoParentFromNewCourseForm(newFormSubmit);
        
        showFormFromParent(false); // Close the form
    };

    return (
        <Modal show={showForm} onHide={() => {console.log("model is closing") ;showFormFromParent(false)}}>
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
                            onChange={(e) => setFormSubmit(prevState => ({ ...prevState, courseName: e.target.value }))}
                        />
                    </Form.Group>
                    <Form.Group controlId="formDescription" className="p-2">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter course description"
                            value={newFormSubmit.description}
                            onChange={(e) => setFormSubmit(prevState => ({ ...prevState, description: e.target.value }))}
                        />
                    </Form.Group>
                    <Form.Group controlId="formVideoUrl" className="p-2">
                        <Form.Label>Video File</Form.Label>
                        <Button
                            type="button"
                            className={`btn ${isButtonGreen ? 'btn-success' : 'btn-primary'}`}
                            onClick={selectVideo}
                        >
                            {selectedVideoName ? `Selected: ${selectedVideoName}` : 'Upload Video'}
                        </Button>
                        <input style={{ display: 'none' }} ref={fileInputRef} type="file" onChange={handleVideoSelected}></input>
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

