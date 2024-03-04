import React, { useState, useEffect } from 'react';
import { Container, ListGroup, Button, Modal, Form } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { fetchReviewsByCourseID, postReview, updateReview } from '../services/reviews-serivce';

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

interface RevForm {
  title: string;
  message: string;
  score: number;
  course_id: string;
}

const CourseReviewsPage: React.FC = () => {
  const location = useLocation();
  const TheCourse = location.state.course; // Assuming course is passed via state
  const [reviews, setReviews] = useState<IcourseReview[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editReview, setEditReview] = useState<IcourseReview | null>(null);
  const [reviewForm, setReviewForm] = useState<RevForm>({ title: '', message: '', score: 1, course_id: TheCourse._id });

  useEffect(() => {
    fetchReviewsByCourseID(TheCourse._id).then(setReviews);
  }, [TheCourse._id]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (editReview) {
      setEditReview({ ...editReview, [name]: value });
    } else {
      setReviewForm({ ...reviewForm, [name]: value });
    }
  };

  const handleStarClick = (score: number) => {
    if (editReview) {
      setEditReview({ ...editReview, score });
    } else {
      setReviewForm({ ...reviewForm, score });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (editReview) {
      await updateReview(editReview);
      setEditReview(null); // Clear edit review state
    } else {
      await postReview({ ...reviewForm, course_name: TheCourse.name, owner_id: 'ownerId', owner_name: 'ownerName' }); // Adjust as per your user identification logic
    }
    fetchReviewsByCourseID(TheCourse._id).then(setReviews); // Refresh reviews list
    setShowModal(false);
  };

  const handleEditClick = (review: IcourseReview) => {
    setEditReview(review);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditReview(null); // Reset edit review state on close
  };

  return (
    <Container>
      <h1>Reviews for {TheCourse.name}</h1>
      <ListGroup>
        {reviews.map(review => (
          <ListGroup.Item key={review._id}>
            <strong>{review.title}</strong> - {review.message}
            <div>
              {Array.from({ length: 5 }, (_, index) => (
                <FaStar key={index} color={index < review.score ? "#ffc107" : "#e4e5e9"} />
              ))}
            </div>
            <Button variant="outline-primary" size="sm" onClick={() => handleEditClick(review)}>Edit</Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button onClick={() => setShowModal(true)}>Add Review</Button>

      {/* Modal for adding/editing a review */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editReview ? 'Edit Review' : 'New Review'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={editReview ? editReview.title : reviewForm.title} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control as="textarea" name="message" value={editReview ? editReview.message : reviewForm.message} onChange={handleInputChange} />
            </Form.Group>
            <Form.Label>Score</Form.Label>
            <div>
              {[1, 2, 3, 4, 5].map(score => (
                <FaStar key={score} onClick={() => handleStarClick(score)} color={score <= (editReview ? editReview.score : reviewForm.score) ? "#ffc107" : "#e4e5e9"} />
              ))}
            </div>
            <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
              Submit Review
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CourseReviewsPage;
