import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Row, Modal, Form } from 'react-bootstrap';
import { BsChevronDown, BsChevronUp, BsTrash, BsPencil } from 'react-icons/bs';
import { deleteCourse, fetchCoursesByOwner, putCourse } from '../services/course-service';

// Assuming fetchData, fetchCoursesBySearch, putCourse, deleteCourse, fetchCoursesByOwner are imported

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
  searchQuery: any;
  selectedOption: string;
  courseAdded: boolean;
  sendCourseIDToParent: (spesificCourse: Course) => void;
}

const MyCourses: React.FC<ChildProps> = ({ searchQuery, selectedOption, courseAdded, sendCourseIDToParent }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [editCourse, setEditCourse] = useState<Course | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedVideoUrl, setEditedVideoUrl] = useState('');

  useEffect(() => {
    fetchCoursesByOwner().then((res) => setCourses(res));
  }, [searchQuery, courseAdded]);

  const handleEditClick = (course: Course) => {
    setEditCourse(course);
    setEditedName(course.name);
    setEditedDescription(course.description);
    setEditedVideoUrl(course.videoUrl);
    setShowEditModal(true);
  };

  const refreshCourses = async () => {
    const updatedCourses = await fetchCoursesByOwner();
    setCourses(updatedCourses);
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourse(courseId); // Call the API service to delete the course
      setCourses(courses.filter(course => course._id !== courseId)); // Update state to remove the deleted course
    } catch (error) {
      console.error("Failed to delete the course:", error);
    }
  };
  
  const handleSaveChanges = async () => {
    if (editCourse) {
      const updatedCourse = {
        ...editCourse,
        name: editedName,
        description: editedDescription,
        videoUrl: editedVideoUrl,
      };
      await putCourse(updatedCourse, editCourse._id);
      setShowEditModal(false);
      refreshCourses(); 
      // Refresh your course list here, possibly by re-fetching the courses or updating the state directly
    }
  };

  return (
    <>
      <Row className='pb-2'>
        {courses.map((course) => (
          <Col className='p-3' key={course._id} xs={12} sm={6} md={4} lg={3}>
            <Card className='p-2' style={{ margin: '10px 0', height: '100%' }}>
              <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <Card.Title>{course.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{course.owner_name}</Card.Subtitle>
                  <Card.Text>{course.description}</Card.Text>
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
                    <Button className='btn p-2 mx-2' variant="info" onClick={() => handleEditClick(course)}><BsPencil /></Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Course Name</Form.Label>
              <Form.Control type="text" placeholder="Enter course name" value={editedName} onChange={(e) => setEditedName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Description" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} />
            </Form.Group>

            {/* Simplified handling, you might need to implement file upload handling */}
            <Form.Group className="mb-3" controlId="formBasicFile">
              <Form.Label>Video URL</Form.Label>
              <Form.Control type="text" placeholder="Video URL" value={editedVideoUrl} onChange={(e) => setEditedVideoUrl(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyCourses;
