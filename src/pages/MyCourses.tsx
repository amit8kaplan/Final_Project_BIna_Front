import React, { useRef, useEffect, useState } from 'react';
import { Button, Card, Col, Row, Modal, Form } from 'react-bootstrap';
import { BsChevronDown, BsChevronUp, BsTrash, BsPencil } from 'react-icons/bs';
import { putCourse, deleteCourse, fetchCoursesByOwner } from '../services/course-service';
import { postVideo } from '../services/course-service';

interface Course {
  _id: string;
  name: string;
  owner: string;
  owner_name: string;
  description: string;
  Count: number;
  videoUrl: string;
}

interface ChildProps {
}

interface Form {
  courseName: string;
  description: string;
  vidSrc: File | null;
}

const MyCourses: React.FC<ChildProps> = () => {
  const [, setVidSrc] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
    const [courses, setCourses] = useState<Course[]>([]);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const [isButtonGreen, setIsButtonGreen] = useState(false);
    const [vidError, setVidError] = useState<string>('');
    const [selectedVideoName, setSelectedVideoName] = useState<string>('');
    const [editTheCourse, setEditTheCourse] = useState<Course>({
        _id: '',
        name: '',
        owner: '',
        owner_name: '',
        description: '',
        Count: 0,
        videoUrl: '',
    });
      const [deletedCourseName, setDeletedCourseName] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const MAX_DESCRIPTION_LENGTH = 50; // Maximum characters to display initially

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  useEffect(() => {
     fetchCoursesByOwner().then((res) => setCourses(res));
    
  }, [showDeletePopup, showEditModal]);

  const handleDeleteCourse = async (courseId: string) => {
    const courseToDelete = courses.find((course) => course._id === courseId);
    if (courseToDelete) {
      await deleteCourse(courseId);
      setDeletedCourseName(courseToDelete.name);
      setShowDeletePopup(true);
      setCourses(courses.filter(course => course._id !== courseId));
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditTheCourse(course);
    setEditedName(course.name);
    setEditedDescription(course.description);
    setShowEditModal(true);
  };

  const saveEditedCourse = async () => {
    if (editTheCourse)
    {
      setEditTheCourse({ ...editTheCourse, name: editedName, description: editedDescription });
      // const updatedCourse: Course = { ...editedCourse, name: editedName, description: editedDescription };
      await putCourse(editTheCourse, editTheCourse._id);
      setCourses(courses.map(course => (course._id === editTheCourse._id ? editTheCourse : course)));
      setShowEditModal(false);
    }
  };

  const handleVideoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
        if (allowedTypes.includes(file.type)) {
            const videoURL = await postVideo(file);
            //console.log("the vid url:" + videoURL)
            setEditTheCourse({ ...editTheCourse, videoUrl: videoURL });
            //console.log("the edit course is: " + editTheCourse)
            setVidSrc(file);
            setVidError('');
            setSelectedVideoName(file.name);
            setIsButtonGreen(true);
            setFormSubmit((prevState: Form) => ({ ...prevState, vidSrc: file }));
          } else {
            setVidError('Please select a valid video file (MP4, WebM, QuickTime).');
        }
    }
};
const selectVideo = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
};
  return (
  <>
  <h1 className="text-center">My Courses</h1>
    <Row className='pb-2'>
      {courses.map((course) => (
        <Col className='p-3' key={course._id} xs={12} sm={6} md={4} lg={3}>
          <Card className='p-2' style={{ margin: '10px 0', height: '100%' }}>
            <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <Card.Title>{course.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{course.owner_name}</Card.Subtitle>
                <Card.Text>
                  {showFullDescription ? course.description : course.description.slice(0, MAX_DESCRIPTION_LENGTH)}
                  {course.description.length > MAX_DESCRIPTION_LENGTH && !showFullDescription && (
                    <span>...</span>
                  )}
                </Card.Text>
              </div>
              <div>
                <video controls style={{ maxWidth: '100%' }}>
                  <source src={course.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <Button className='btn p-2' onClick={() => handleDeleteCourse(course._id)} variant="danger"><BsTrash /></Button>
                  <Button className='btn p-2 mx-2' variant="info" onClick={() => handleEditCourse(course)}><BsPencil /></Button>
                  <Button className='btn p-2' onClick={toggleDescription} variant="outline-primary" size="sm">
                    {showFullDescription ? 'Show Less' : 'Show More'} {showFullDescription ? <BsChevronUp /> : <BsChevronDown />}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCourseName">
              <Form.Label>Course Name</Form.Label>
              <Form.Control type="text" placeholder="Enter course name" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter course description" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
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
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveEditedCourse}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
      {/* Popup */}
      <Modal show={showDeletePopup} onHide={() => setShowDeletePopup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Course Deleted</Modal.Title>
        </Modal.Header>
        <Modal.Body>Course '{deletedCourseName}' has been successfully deleted.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeletePopup(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </Row>
    </>      
  );
}

export default MyCourses;
function setFormSubmit(_arg0: (prevState: Form) => { vidSrc: File; courseName: string; description: string; }) {
  throw new Error('Function not implemented.');
}

