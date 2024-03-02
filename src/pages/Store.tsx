import React, { useCallback, useEffect, useRef, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import CourseCards from '../components/Courses_cards';
import NewCourseForm from '../components/new_course_form';
import { useNavigate } from 'react-router-dom';
import { postCourse, postVideo } from '../services/course-service';

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
    showFormFromParent: boolean;
    sendDatatoParentFromNewCourseForm: (data: Form) => void;
    sendCourseIDToParent: (spesificCourse: Course) => void;
  
  }
export const CourseList: React.FC<ChildProps> = () => {
  const fileInputRef = useRef<HTMLInputElement>(null); // useRef for the file input
  const [showForm, setShowForm] = useState(false);
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
}, [courseAdded]); // You may need to adjust the dependencies based on your requirements


// Function to handle selecting an option from the dropdown
const handleSelectOption = (option: string) => {
  setSelectedOption(option);
}
  const [selectedVideoName, setSelectedVideoName] = useState<string>('');
  const [isButtonGreen, setIsButtonGreen] = useState<boolean>(false);
  const [courseName, setSelectedCourseName] = useState<string>('');

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
  
    // Define a callback function to receive data from the child
    const receiveDataFromChild = useCallback((data: Form) => {
      console.log ('the received data is:', data)
      if (data!=undefined){
        handleSubmit(data);
      }
    }, []);
  const receiveShowFormFromChild = useCallback((data: boolean) => {
    console.log ('the received show form is:', data)
    setShowForm(data);
  }, []);
  const receiveShowRevFromChile = useCallback((data: boolean) => {
    console.log ('the received show rev is:', data)
    setShowReviewsModal(data);
  } , []);
  const navigate = useNavigate(); // Hook for navigation

  const [courseID, setCourseID] = useState<string>('');
  const fetchReviews = useCallback((spes_course: Course) => {
      console.log("the course id is in fetchRev:" + spes_course._id)
      // console.log("the course id is in fetchRev:" + courseID)
      setCourseID(spes_course._id);
      const queryString = `?course_id=${spes_course._id}`;
      navigate(`/course_review/${queryString}`,
  {
    state: { course: spes_course} 
  }); // Navigate to the reviews page
      // const response = await apiClient.get(`/review/${courseId}`);
      // setReviews(response.data);
      // setSelectedCourseName(courseName); // Set the selected course name
      // setShowReviewsModal(true);

    // } catch (error) {
    //   console.error('Error fetching reviews:', error);
    // }
  }, [navigate]);
  
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
      <CourseCards courseAdded={courseAdded} searchQuery={searchQuery} selectedOption={selectedOption} sendCourseIDToParent={fetchReviews} />
     {showForm && <NewCourseForm showForm ={showForm}  sendDatatoParentFromNewCourseForm={receiveDataFromChild}  showFormFromParent={receiveShowFormFromChild} />}
     {showReviewsModal && <ReviewsModal sendCourseIDToReviews={courseID}  showReviewsModal={showReviewsModal} showRevFromParent={receiveShowRevFromChile}/>}
    </Container>
  );
};

export default CourseList;

