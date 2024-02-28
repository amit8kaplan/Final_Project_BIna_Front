import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import apiClient from '../services/api-client';
import { string } from 'zod';

interface Course {
  name: string;
  owner: string;
  owner_name: string;
  description: string;
  Count: number;
  videoUrl: string;
}

export const CourseList: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null); // useRef for the file input
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [vidSrc, setvidSrc] = useState<File>()
  const [booleanRandom, setBooleanRandom] = useState<boolean>(false);
  const [vidError, setvidError] = useState<string>('');
  const [newCourse, setNewCourse] = useState<Course>({
    name: '',
    owner: '',
    owner_name: '',
    description: '',
    Count: 0,
    videoUrl: '',
  });
  const [selectedVideoName, setSelectedVideoName] = useState<string>('');
  const [isButtonGreen, setIsButtonGreen] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await apiClient.get('/course');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (!vidSrc) {
        console.error('Please select a video file.');
        return;
      }
      else
      {
        console.log("the video is selected" + vidSrc)
      }
  
      // Upload video file first
      const formData = new FormData();
      console.log("The type of the formdata" + typeof formData)
      formData.append('video', vidSrc);
      console.log("the token"+ localStorage.getItem('token'))

      const videoUploadResponse = await apiClient.post('/course/upload_Video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const reqBody ={
        owner: '', // this is the user id
        Count: 0,
          owner_name: '',
          name: newCourse.name,
          description: newCourse.description,
          videoUrl: videoUploadResponse.data.url
        }
        console.log("the request body is:" + JSON.stringify(reqBody))
        console.log("the type of request body is:" + typeof reqBody)
        console.log("the token"+ localStorage.getItem('token'))
      const videoUrl = videoUploadResponse.data.url;
      console.log("the video url is:" + videoUrl)
      // Create new course object with videoUrl
      const newCourseWithVideo = { ...newCourse, videoUrl };
      console.log("the new course with video is:" + JSON.stringify(newCourseWithVideo))
      console.log("type of name" + typeof newCourseWithVideo.name)
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
      console.log("the headers are:" + JSON.stringify(headers))
      // Post the course with the videoUrl
      await fetch('http://localhost:3000/course/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body:  JSON.stringify({
          owner: '', // this is the user id
          Count: 0,
          owner_name: '',
          name: newCourse.name,
          description: newCourse.description,
          videoUrl: videoUploadResponse.data.url
          
        })
      }).then((response) => {
        console.log("the response is:" + (response))
        return response.json();
      }).then((data) => {
        console.log("the data is:" + JSON.stringify(data))
      }
      ).catch((error) => {
        console.error('Error:', error);
      });
  
      setShowForm(false);
      setNewCourse({
        _id: '',
        name: '',
        owner: '',
        owner_name: '',
        description: '',
        Count: 0,
        videoUrl: '',
      });
      setvidSrc(undefined);
      fetchData(); // Fetch updated course list after adding a new course
    } catch (error) {
      console.error('Error adding new course:', error);
    }
  };
  const selectvid = () => {
    console.log("Selecting video...")
    if (fileInputRef.current) {
      fileInputRef.current.click();
      console.log("Selecting video..." + fileInputRef.current)
    }
  }
  
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
      } else {
        setvidError('Please select a valid video file (MP4, WebM, QuickTime).');
      }
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Button onClick={() => setShowForm(true)}>Add New Course</Button>
        </Col>
      </Row>
      <Row>
        {courses.map((course) => (
          <Col key={course._id} xs={12} sm={6} md={4} lg={3}>
            <Card style={{ margin: '10px 0' }}>
              <Card.Body>
                <Card.Title>{course.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{course.owner_name}</Card.Subtitle>
                <Card.Text>{course.description}</Card.Text>
                <Card.Link href={course.videoUrl}>Watch Video</Card.Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={showForm} onHide={() => setShowForm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formCourseName" className='p-2'>
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter course name"
                value={newCourse.name}
                onChange={(e) => setNewCourse(prevState => ({ ...prevState, name: e.target.value }))}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className='p-2'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter course description"
                value={newCourse.description}
                onChange={(e) => setNewCourse(prevState => ({ ...prevState, description: e.target.value }))}
              />
            </Form.Group>
            <Form.Group controlId="formVideoUrl" className='p-2'>
              <Form.Label>Video File</Form.Label>

              <Button
                type="button"
                className={`btn ${isButtonGreen ? 'btn-success' : 'btn-primary'}`} // Dynamically set button color
                onClick={selectvid}
              >
                {selectedVideoName ? `Selected: ${selectedVideoName}` : 'Upload Video'}
              </Button>
              <input style={{ display: "none" }} ref={fileInputRef} type="file" onChange={vidSelected}></input>
              {vidError && <p className="text-danger">{vidError}</p>}
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CourseList;