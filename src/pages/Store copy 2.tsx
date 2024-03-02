import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import apiClient from '../services/api-client';
import { string } from 'zod';
import { set } from 'react-hook-form';
import Dropdown from 'react-bootstrap/Dropdown';
import CourseCards from '../components/Courses_cards';
import NewCourseForm from '../components/new_course_form';
import  {fetchData, fetchCoursesBySearch, postCourse, postVideo} from '../services/course-service';
// Inside the CourseCard component:

interface IcourseReview {
  _id: string;
  course_id: string;
  course_name: string;
  title: string;
  message: string;
  score: number;
  owner_id: string;
  owner_name: string;
}
interface Course {
  _id: string;
  name: string;
  owner: string;
  owner_name: string;
  description: string;
  Count: number;
  videoUrl: string;
}
interface Form {
  courseName: string;
  description: string;
  vidSrc: File | null;
  }
  interface ChildProps {
    // sendDataToParentFromCourses_cards: (data: Form) => void;
    showFormFromParent: boolean;
    // showFormFromParent: (data: boolean) => void;
    sendDatatoParentFromNewCourseForm: (data: Form) => void;
    
  }
export const CourseList: React.FC<ChildProps> = () => {
  const fileInputRef = useRef<HTMLInputElement>(null); // useRef for the file input
  const [showForm, setShowForm] = useState(false);
  // const [vidSrc, setvidSrc] = useState<File>();
  const [booleanRandom, setBooleanRandom] = useState<boolean>(false);
  const [vidError, setvidError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<string>('name'); // Default selected option
  const [reviews, setReviews] = useState<IcourseReview[]>([]);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [courseAdded, setCourseAdded] = useState<boolean>(false); // State to track if a new course has been added
const [newReview, setNewReview] = useState<IcourseReview>({
  _id: '',
  course_id: '',
  course_name: '',
  title: '',
  message: '',
  score: null,
  owner_id: '',
  owner_name: '',
});
const handleOpenAddReviewModal = () => {
  setShowAddReviewModal(true);
};
useEffect(() => {
  setCourseAdded(false); // Toggle the courseAdded state to trigger a re-fetch of courses
  // setShowForm(false); // Close the form after a new course is added
}, [courseAdded]); // You may need to adjust the dependencies based on your requirements


// Function to handle selecting an option from the dropdown
const handleSelectOption = (option: string) => {
  setSelectedOption(option);
}
  const [selectedVideoName, setSelectedVideoName] = useState<string>('');
  const [isButtonGreen, setIsButtonGreen] = useState<boolean>(false);
  const [courseName, setSelectedCourseName] = useState<string>('');

const fetchReviews = async (courseId: string, courseName: string) => {
  try {
    const response = await apiClient.get(`/review/${courseId}`);
    setReviews(response.data);
    setSelectedCourseName(courseName); // Set the selected course name
    setShowReviewsModal(true);
  } catch (error) {
    console.error('Error fetching reviews:', error);
  }
};

  const handleSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = async (data: Form) => {
    console.log("the local storage token is:" + sessionStorage.getItem('accessToken'))
    try {
      if (!data.vidSrc) {
        console.error('Please select a video file.');
        return;
      }
      console.log("upload to vid first")
      const videoUrl = await postVideo(data.vidSrc);
      console.log("the vid url is:" + videoUrl)
      // Upload video file first
      // const formData = new FormData();
      // formData.append('video', data.vidSrc);

      // const videoUploadResponse = await apiClient.post('/course/upload_Video', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //     Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
      //   },
      // });

      // const videoUrl = videoUploadResponse.data.url;
      const newCourse = {
        name: data.courseName,
        owner: '', // this is the user id
        owner_name: '',
        description: data.description,
        Count: 0,
        videoUrl: videoUrl,
      };
      postCourse(newCourse);
      setShowForm(false);
      setCourseAdded(true);
    } catch (error) {
      console.error('Error adding new course:', error);
    }
  };

  // const toggleNewCourseForm = () => {
  //   setShowForm(!showForm); // Toggle the showForm state
  // };
 

    // const [receivedData, setReceivedData] = useState<Form>(); // Update the type of receivedData
  
    // Define a callback function to receive data from the child
    const receiveDataFromChild = useCallback((data: Form) => {
      // setReceivedData(data);
      console.log ('the received data is:', data)
      if (data!=undefined){
        handleSubmit(data);
      }
    }, []);
  // const [recevicedShowForm, setReceivedShowForm] = useState<boolean>(false);
  const receiveShowFormFromChild = useCallback((data: boolean) => {
    // setReceivedData(data);
    console.log ('the received show form is:', data)
    // setReceivedShowForm(data);
    setShowForm(data);
  }, []);

  return (
    <Container>
      <Row  >
        <Col className='p-2'>
          <Button onClick={() => {setShowForm(true); console.log("in store the form is:" + showForm);}}>Add New Course</Button>
          <Form.Control
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={handleSearchQueryChange}
            className="ml-2"
          />
          <Dropdown className="mr-2">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
              {selectedOption}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSelectOption('name')}>Name</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectOption('description')}>Description</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectOption('Count')}>Popular buying</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectOption('owner')}>Owner</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSelectOption('_id')}>ID</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <CourseCards courseAdded={courseAdded} searchQuery={searchQuery} selectedOption={selectedOption} fetchReviews={fetchReviews} />
      {/* <NewCourseForm   toggleForm={toggleNewCourseForm}  sendDatatoParentFromNewCourseForm={receiveDataFromChild} showFormFromParent={receiveShowFormFromChild} /> */}
      {showForm && <NewCourseForm showForm ={showForm}  sendDatatoParentFromNewCourseForm={receiveDataFromChild}  showFormFromParent={receiveShowFormFromChild} />}
      <Modal show={showReviewsModal} onHide={() => setShowReviewsModal(true)} coursename={courseName} >
        <Modal.Header closeButton>
          <Modal.Title>Reviews for {courseName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Display reviews here */}
          {reviews.map(review => (
            <div key={review._id}>
              <h5>{review.owner_name}</h5>
              <p>{review.message}</p>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewsModal(false)}>Close</Button>
          <Button variant="primary">Add a Review</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CourseList;


{/* <Modal show={showAddReviewModal} onHide={() => setShowAddReviewModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Waiting for Your Insights!</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={handleSubmitReview}>
      const newReview = {
        title: '',
        message: '',
        score: 0
      };

      <Form.Group controlId="formReviewTitle" className="p-2">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter review title"
          value={newReview.title}
          onChange={(e) => setNewReview((prevState) => ({ ...prevState, title: e.target.value }))}
        />
      </Form.Group>
      <Form.Group controlId="formReviewMessage" className="p-2">
        <Form.Label>Message</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Enter review message"
          value={newReview.message}
          onChange={(e) => setNewReview((prevState) => ({ ...prevState, message: e.target.value }))}
        />
      </Form.Group>
      <Form.Group controlId="formReviewScore" className="p-2">
        <Form.Label>Score</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter review score"
          value={newReview.score}
          onChange={(e) => setNewReview((prevState) => ({ ...prevState, score: parseInt(e.target.value) }))}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit Review
      </Button>
    </Form>
  </Modal.Body>
</Modal> */}



// function postCourse(newCourse: {
//   _id: string; name: string; owner: string; // this is the user id
//   owner_name: string; description: string; Count: number; videoUrl: any;
// }) {
//   throw new Error('Function not implemented.');
// }
 // // Post the course with the videoUrl
      // await fetch('http://localhost:3000/course/', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
      //   },
      //   body: JSON.stringify({
      //     owner: '', // this is the user id
      //     Count: 0,
      //     owner_name: '',
      //     name: newCourse.name,
      //     description: newCourse.description,
      //     videoUrl: videoUploadResponse.data.url,
      //   }),
      // });

      // setShowForm(false);
      // setNewCourse({
      //   _id: '',
      //   name: '',
      //   owner: '',
      //   owner_name: '',
      //   description: '',
      //   Count: 0,
      //   videoUrl: '',
      // });
      // setvidSrc(undefined);

      //  {/* <Modal show={showForm} onHide={() => setShowForm(false)}>
      //   <Modal.Header closeButton>
      //     <Modal.Title>Add New Course</Modal.Title>
      //   </Modal.Header>
      //   <Modal.Body>
      //     <Form onSubmit={handleSubmit}>
      //       <Form.Group controlId="formCourseName" className="p-2">
      //         <Form.Label>Course Name</Form.Label>
      //         <Form.Control
      //           type="text"
      //           placeholder="Enter course name"
      //           value={newCourse.name}
      //           onChange={(e) => setNewCourse((prevState) => ({ ...prevState, name: e.target.value }))}
      //         />
      //       </Form.Group>
      //       <Form.Group controlId="formDescription" className="p-2">
      //         <Form.Label>Description</Form.Label>
      //         <Form.Control
      //           as="textarea"
      //           rows={3}
      //           placeholder="Enter course description"
      //           value={newCourse.description}
      //           onChange={(e) => setNewCourse((prevState) => ({ ...prevState, description: e.target.value }))}
      //         />
      //       </Form.Group>
      //       <Form.Group controlId="formVideoUrl" className="p-2">
      //         <Form.Label>Video File</Form.Label>

      //         <Button
      //           type="button"
      //           className={`btn ${isButtonGreen ? 'btn-success' : 'btn-primary'}`} // Dynamically set button color
      //           onClick={selectvid}
      //         >
      //           {selectedVideoName ? `Selected: ${selectedVideoName}` : 'Upload Video'}
      //         </Button>
      //         <input style={{ display: 'none' }} ref={fileInputRef} type="file" onChange={vidSelected}></input>
      //         {vidError && <p className="text-danger">{vidError}</p>}
      //       </Form.Group>
      //       <Button variant="primary" type="submit">
      //         Submit
      //       </Button>
      //     </Form>
      //   </Modal.Body>
      // </Modal> */}

      // const handleSubmitReview = async (event: React.FormEvent<HTMLFormElement>) => {
      //   event.preventDefault();
      //   try {
      //     // Implement logic for submitting review
      //     console.log("Submitting review:", newReview);
      //     // Close the "Add Review" modal after submission
      //     setShowAddReviewModal(false);
      //     // Clear the newReview state
      //     setNewReview({
      //       title: '',
      //       message: '',
      //       score: undefined,
      //     });
      //   } catch (error) {
      //     console.error('Error submitting review:', error);
      //   }
      // };