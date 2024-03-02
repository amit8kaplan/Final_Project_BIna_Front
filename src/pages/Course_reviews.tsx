
import { fetchReviewsByCourseID, postReview } from '../services/reivew-serivce';
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Container, ListGroup, Button, Modal, Form } from 'react-bootstrap'; // Import Modal and Form from react-bootstrap
import { FaStar } from 'react-icons/fa'; // Import star icon from react-icons/fa
import { post } from 'jquery';
import { fetchCoursesBySearch } from '../services/course-service';
import { set } from 'react-hook-form';
interface IcourseReview {
  _id: string;
  title: string;
  message: string;
  score: number;
}
interface RevForm{
  title: string;
  message: string;
  score: number;
  course_id: string | null;
}
interface Course{
  _id: string;
  name: string;
  owner: string;
  owner_name: string;
  description: string;
  Count: number;
  videoUrl: string;
}
interface Review{
  course_id: string;
  course_name: string;
  title: string;
  message: string;
  score: number;
  owner_id: string;
  owner_name: string;

}

const CourseReviewsPage: React.FC = () => {
  const location = useLocation();
  
  const searchParams = new URLSearchParams(location.search);
  const TheCourse = location.state.course;
  const courseID = searchParams.get('course_id');
  const [course, setCourse] = useState<Course>(); // State to store the course details
  const [submitRev, setSubmitRev] = useState<Review>();
  const [reviews, setReviews] = useState<IcourseReview[]>([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [reviewForm, setReviewForm] = useState<RevForm>({
    title: '',
    message: '',
    score: 0,
    course_id: courseID ,
  });

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  // const fetchCourseData = async () => {
  //   try {
  //     console.log("the course id in fetch is:", courseID);
  //     if (!courseID) return;

  //     // Fetch course details by courseID
  //     const res = await fetchCoursesBySearch(courseID, "id");
  //     setCourse(res);
  //     setSubmitRev({
  //       course_id: res._id,
  //       course_name: res.name,
  //       title: '',
  //       message: '',
  //       score: 0,
  //       owner_id: res.owner,
  //       owner_name: res.owner_name
  //     });
  //     console.log(submitRev)
  //     console.log(JSON.stringify(res) + "the course is:" + res); // Log the fetched course details
  //   } catch (error) {
  //     console.error('Error fetching course details:', error);
  //   }
  // }
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setReviewForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleStarClick = (score: number) => {
    setReviewForm(prevState => ({
      ...prevState,
      score: score
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLAnchorElement>) => {
    e.preventDefault(); 
    try {
      console.log('Submitted Review:', reviewForm);
      const submitRev: Review = {
        course_id: courseID || '', // Set a default value of an empty string if courseID is null
        course_name: TheCourse.name,
        title: reviewForm.title || '',
        message: reviewForm.message,
        score: reviewForm.score || 3,
        owner_id: TheCourse.owner,
        owner_name: TheCourse.owner_name
      };
      console.log("the temp form is:", submitRev);
      await postReview(submitRev);
      setNewRev(true);
      handleClose();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      if (!courseID) return;
      const res = await fetchReviewsByCourseID(courseID);
      setReviews(res);
      console.log("the reviews are:", res); // Log the fetched reviews
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const [newRev, setNewRev] = useState(false);
  useEffect(() => {
    fetchReviews();
    newRev ? setNewRev(false) : null;

  }, [courseID, TheCourse, newRev]);

  return (
    <Container>
      <h1>Reviews for Course {course?.name}</h1>
      <ListGroup>
        {reviews.map(review => (
          <ListGroup.Item key={review._id} action href={`#${review._id}`}>
            {review.title}
          </ListGroup.Item>
        ))}
      </ListGroup>
      {/* Render review details */}
      {reviews.map(review => (
        <div key={review._id} id={review._id}>
          <h2>{review.title}</h2>
          <p>{review.message}</p>
          {/* Add more details if needed */}
        </div>
      ))}
      {/* Add new review button */}
      <div style={{ textAlign: 'center', margin: '20px auto' }}>
        <Button variant="primary" onClick={handleShow}>Add new review!</Button>
      </div>
      {/* Modal for adding new review */}
      <Modal show={showModal} onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>Your review for the course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter review title" name="title" value={reviewForm.title} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="message">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Enter your review" name="message" value={reviewForm.message} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="score">
              <Form.Label>Score</Form.Label>
              <div>
                {[...Array(5)].map((star, index) => {
                  const score = index + 1;
                  return (
                    <FaStar 
                      key={index} 
                      color={score <= reviewForm.score ? "#ffc107" : "#e4e5e9"} 
                      style={{ cursor: 'pointer' }} 
                      onClick={() => handleStarClick(score)} 
                    />
                  );
                })}
              </div>
            </Form.Group>
            <div  style={{textAlign: 'center'}} >
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CourseReviewsPage;

