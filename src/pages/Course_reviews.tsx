
import { fetchReviewsByCourseID } from '../services/reivew-serivce';
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Container, ListGroup, Button, Modal, Form } from 'react-bootstrap'; // Import Modal and Form from react-bootstrap
import { FaStar } from 'react-icons/fa'; // Import star icon from react-icons/fa

interface IcourseReview {
  _id: string;
  title: string;
  message: string;
  score: number;
}

const CourseReviewsPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseID = searchParams.get('course_id');

  const [reviews, setReviews] = useState<IcourseReview[]>([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [reviewForm, setReviewForm] = useState<IcourseReview>({
    title: '',
    message: '',
    score: 0
  });

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

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

  useEffect(() => {
    // Fetch reviews for the given courseID
    console.log("the course id in course-rev is:", courseID);
    fetchReviews();
  }, [courseID]);

  return (
    <Container>
      <h1>Reviews for Course {courseID}</h1>
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
            <Form onSubmit={handleSubmit}>
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

