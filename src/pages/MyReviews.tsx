import React, { useEffect, useState } from 'react';
import { Container, ListGroup, Modal, Button } from 'react-bootstrap';
import { fetchReviewsByOwner, deleteReview, updateReview } from '../services/review-service';
import { FaStar, FaTrashAlt, FaPen, FaArrowDown } from 'react-icons/fa';

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
    const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);
    const [showReviewPopUp, setShowReviewPopUp] = useState(false);

    useEffect(() => {
        fetchReviewsByOwner().then(setReviews);
    }, []);

    const handleClose = () => {
        setShowModal(false);
        setShowReviewPopUp(false);
        setSelectedReview(null);
    };

    const saveEditedRev = async () => {
        if (selectedReview) {
            await updateReview(selectedReview);
            setReviews(reviews.map(rev => rev._id === selectedReview._id ? selectedReview : rev));
            handleClose();
        }
    };

    const handleShowDeleteConfirmation = (id: string) => {
        setDeleteReviewId(id);
        setShowDeletePopUp(true);
    };

    const confirmDeleteReview = async () => {
        if (deleteReviewId) {
            await deleteReview(deleteReviewId);
            setReviews(reviews.filter(rev => rev._id !== deleteReviewId));
            setDeleteReviewId(null);
        }
        setShowDeletePopUp(false);
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
                                    <span className="font-weight-bold">{review.course_name}</span>
                                    <span className="text-muted"> - {review.owner_name}</span>
                                </div>
                                <div className="mt-1">{review.title}</div>
                            </div>
                            <div>
                                {[...Array(5)].map((_, index) => (
                                    <FaStar
                                        key={index}
                                        color={index < review.score ? "#ffc107" : "#e4e5e9"}
                                    />
                                ))}
                            </div>
                            <div>
                                <FaTrashAlt
                                    className="mr-3"
                                    onClick={() => handleShowDeleteConfirmation(review._id)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <FaPen
                                    onClick={() => handleShowEdit(review)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <FaArrowDown
                                    onClick={() => handleShowReview(review)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </div>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            {/* Edit Review Modal */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReview && (
                        <>
                            <label>Title</label>
                            <input
                                type="text"
                                className="form-control"
                                value={selectedReview.title}
                                onChange={(e) => setSelectedReview({ ...selectedReview, title: e.target.value })}
                            />
                            <label>Message</label>
                            <textarea
                                className="form-control"
                                rows={3}
                                value={selectedReview.message}
                                onChange={(e) => setSelectedReview({ ...selectedReview, message: e.target.value })}
                            />
                            {/* Score editing can be similarly implemented */}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="primary" onClick={saveEditedRev}>Save Changes</Button>
                </Modal.Footer>
            </Modal>

            {/* Confirmation Modal for Deleting a Review */}
            <Modal show={showDeletePopUp} onHide={() => setShowDeletePopUp(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Review</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this review?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeletePopUp(false)}>Cancel</Button>
                    <Button variant="danger" onClick={confirmDeleteReview}>Delete</Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for Showing Full Review Details */}
            <Modal show={showReviewPopUp} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Review Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedReview && (
                        <>
                            <h4>{selectedReview.title}</h4>
                            <p>{selectedReview.message}</p>
                            <div style={{ textAlign: 'center' }}>
                                {[...Array(5)].map((_, index) => (
                                    <FaStar
                                        key={index}
                                        color={index < selectedReview.score ? "#ffc107" : "#e4e5e9"}
                                    />
                                ))}
                            </div>
                            <div className="mt-2">
                                <strong>Course Name:</strong> {selectedReview.course_name}<br/>
                                <strong>Reviewed By:</strong> {selectedReview.owner_name}
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default MyReviews;
