import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Modal } from 'react-bootstrap';
import { BsChevronDown, BsChevronUp, BsTrash, BsPencil } from 'react-icons/bs';
import { fetchData, fetchCoursesBySearch, putCourse, deleteCourse, fetchCoursesByOwner } from '../services/course-service';

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

const MyCourses: React.FC<ChildProps> = ({ searchQuery, selectedOption, courseAdded , sendCourseIDToParent}) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const MAX_DESCRIPTION_LENGTH = 50; // Maximum characters to display initially
  const [showFullDescription, setShowFullDescription] = useState(false);

  const [deletedCourseName, setDeletedCourseName] = useState('');
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  useEffect(() => {
     fetchCoursesByOwner().then((res) => setCourses(res));
    
  }, [searchQuery, courseAdded]);

  const handleDeleteCourse = async (courseId: string) => {
    const courseToDelete = courses.find((course) => course._id === courseId);
    if (courseToDelete) {
      await deleteCourse(courseId);
      setDeletedCourseName(courseToDelete.name);
      setShowDeletePopup(true);
      setCourses(courses.filter(course => course._id !== courseId));
    }
  };

  return (
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
                  <Button className='btn p-2 mx-2' variant="info" onClick={() => sendCourseIDToParent(course)}><BsPencil /></Button>
                  <Button className='btn p-2' onClick={toggleDescription} variant="outline-primary" size="sm">
                    {showFullDescription ? 'Show Less' : 'Show More'} {showFullDescription ? <BsChevronUp /> : <BsChevronDown />}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
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
  );
}

export default MyCourses;
