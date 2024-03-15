import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Modal, Button } from 'react-bootstrap';
import { fetchReviewsByOwner, deleteReview, updateReview } from '../services/review-service'; // Import deleteReview function
import { FaStar, FaTrashAlt, FaPen, FaArrowDown } from 'react-icons/fa'; // Import FaArrowDown for "Show More" button

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

const MyReviews: React.FC = () => {
    const [reviews, setReviews] = useState<IcourseReview[]>([]);
    const [selectedReview, setSelectedReview] = useState<IcourseReview | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeletePopUp, setShowDeletePopUp] = useState(false);
    const [showReviewPopUp, setShowReviewPopUp] = useState(false);

    useEffect(() => {
        fetchReviewsByOwner().then((res) => setReviews(res));
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setSelectedReview(null);
    };
    const saveEditedRev = async () => {
        if (selectedReview) {
            console.log(selectedReview._id)
            await updateReview(selectedReview);
            setShowModal(false);
            setSelectedReview(null);
            setReviews(reviews.map((rev) => (rev._id === selectedReview._id ? selectedReview : rev)));
        }
    }
    const handleDeleteRev = async (id: string) => {
        const revToDel = reviews.find((rev) => rev._id === id);
        if (revToDel) {
            await deleteReview(id);
            setShowDeletePopUp(true);
            setReviews(reviews.filter((rev) => rev._id !== id));
        }
    };

    const handleShowEdit = (review: IcourseReview) => {
        setSelectedReview(review);
        setShowModal(true);
    };

    const handleShowReview = (review: IcourseReview) => {
        setSelectedReview(review);
        setShowReviewPopUp(true);
    };

    return (
        <Container>
            <h1 className="text-center">My Reviews</h1>
            <ListGroup>
                {reviews.map(review => (
                    <ListGroup.Item key={review._id}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <div>
                                    <span className="font-weight-bold" title="Course Name">{review.course_name}</span>
                                    <span className="text-muted"> - {review.owner_name}</span>
                                </div>
                                <div className="mt-1" title="Review Title">{review.title}</div>
                            </div>
                            <div>
                                {[...Array(5)].map((_, index) => {
                                    const score = index + 1;
                                    return (
                                        <FaStar
                                            key={index}
                                            color={score <= review.score ? "#ffc107" : "#e4e5e9"}
                                            style={{ cursor: 'default' }}
                                            title={`Rating: ${review.score}/5`}
                                        />
                                    );
                                })}
                            </div>
                            <div>
                                <FaTrashAlt
                                    className="mr-3 m-1"
                                    style={{ cursor: 'pointer' }}
                                    title="Delete Review"
                                    onClick={() => handleDeleteRev(review._id)}
                                />
                                <FaPen
                                    className = "m-1"
                                    style={{ cursor: 'pointer' }}
                                    title="Edit Review"
                                    onClick={() => handleShowEdit(review)}
                                />
                                <FaArrowDown
                                    className="ml-3 m-1"
                                    style={{ cursor: 'pointer' }}
                                    title="Show Full Review"
                                    onClick={() => handleShowReview(review)}
                                />
                            </div>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            {/* Modal for showing review details */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReview && (
                        <>
                            <div className="mb-3">
                                <label htmlFor="reviewTitle" className="form-label" title="Review Title">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="reviewTitle"
                                    value={selectedReview.title}
                                    onChange={(e) => setSelectedReview(prevState => ({ ...prevState, title: e.target.value }))}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="reviewMessage" className="form-label" title="Review Message">Message</label>
                                <textarea
                                    className="form-control"
                                    id="reviewMessage"
                                    rows={3}
                                    value={selectedReview.message}
                                    onChange={(e) => setSelectedReview(prevState => ({ ...prevState, message: e.target.value }))}
                                ></textarea>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                {[...Array(5)].map((_, index) => {
                                    const score = index + 1;
                                    return (
                                        <FaStar
                                            key={index}
                                            color={score <= selectedReview.score ? "#ffc107" : "#e4e5e9"}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setSelectedReview(prevState => ({ ...prevState, score: score }))}
                                        />
                                    );
                                })}
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={saveEditedRev}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            {/* Popup for full review */}
            <Modal show={showReviewPopUp} onHide={() => setShowReviewPopUp(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Full Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReview && (
                        <>
                            <div>
                                <span className="font-weight-bold" title="Course Name">{selectedReview.course_name}</span>
                                <span className="text-muted"> - {selectedReview.owner_name}</span>
                            </div>
                            <hr />
                            <div>
                                <span className="font-weight-bold" title="Review Title">Title:</span> {selectedReview.title}
                            </div>
                            <div className="mt-3" title="Review Message">{selectedReview.message}</div>
                            <div className="mt-3" style={{ textAlign: 'center' }}>
                                {[...Array(5)].map((_, index) => {
                                    const score = index + 1;
                                    return (
                                        <FaStar
                                            key={index}
                                            color={score <= selectedReview.score ? "#ffc107" : "#e4e5e9"}
                                            style={{ cursor: 'default' }}
                                            title={`Rating: ${selectedReview.score}/5`}
                                        />
                                    );
                                })}
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReviewPopUp(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Popup for review deletion confirmation */}
            <Modal show={showDeletePopUp} onHide={() => setShowDeletePopUp(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this review?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeletePopUp(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleDeleteRev}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MyReviews;
