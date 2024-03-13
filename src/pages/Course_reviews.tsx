import '../css/CourseReviewsPage.css'; // Import CSS file for styling
import { fetchReviewsByCourseID, postReview } from '../services/review-service';
import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Container, ListGroup, Button, Modal, Form } from 'react-bootstrap'; // Import Modal and Form from react-bootstrap
import { FaStar } from 'react-icons/fa'; // Import star icon from react-icons/fa
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
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const searchParams = new URLSearchParams(location.search);
  const TheCourse = location.state.course;
  const courseID = searchParams.get('course_id');
  const [reviews, setReviews] = useState<IcourseReview[]>([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [reviewForm, setReviewForm] = useState<RevForm>({
    title: '',
    message: '',
    score: 0,
    course_id: courseID ,
  });

  const handleClose = () => {
    setShowModal(false);
    setSelectedReview(null);
  }
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
      <h1>Reviews for Course {TheCourse.name}</h1>
      <ListGroup>
        {reviews.map(review => (
          <ListGroup.Item key={review._id} action onClick={() => setSelectedReview(review)}>
            {review.title}
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Modal for showing review details */}
      <Modal show={selectedReview !== null} onHide={handleClose}>
       
          <Modal.Header closeButton>
          <div style={{ textAlign: 'center' }}>
            <Modal.Title>Review From: {selectedReview?.owner_name}</Modal.Title>
        </div>
          </Modal.Header>
        <Modal.Body>
          {selectedReview && (
            <>
              <div style={{ textAlign: 'center' }}>
              <h2>{selectedReview.title}</h2>
              </div>
              <div style={{ textAlign: 'center' }}>
              <p>{selectedReview.message}</p>
              </div>
              <div style={{textAlign:'center'}}>
                {[...Array(5)].map((star, index) => {
                  const score = index + 1;
                  return (
                    <FaStar
                      key={index}
                      color={score <= selectedReview.score ? "#ffc107" : "#e4e5e9"}
                    />
                  );
                })}
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Add new review button */}
      <div style={{ textAlign: 'center', margin: '20px auto' }}>
        <Button variant="primary" onClick={handleShow}>Add new review!</Button>
        <Button variant="secondary" onClick={() => window.location.href = '/store'} style={{ marginLeft: '10px' }}>Return to Store</Button>
      </div>

      {/* Modal for adding new review */}
      <Modal show={showModal} onHide={handleClose}>
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
            <div style={{ textAlign: 'center' }}>
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

