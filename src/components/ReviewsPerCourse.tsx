import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Modal } from 'react-bootstrap';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import { fetchData, fetchCoursesBySearch, putCourse } from '../services/course-service';


interface ChildProps {
    showReviewsModal: boolean;
    sendCourseIDToReviews: string;
    showRevFromParent: (data: boolean) => void;
  }
  
const ReviewsModal: React.FC<ChildProps> = ({showRevFromParent, showReviewsModal, sendCourseIDToReviews }) => {
    const [showReviews, setShowReviews] = useState(false);
    const handleReviews = (showReviews: boolean, courseId: string) => {
        console.log("the course id is:" + courseId)
        showRevFromParent(false);

    }
    return (
        <div>
            <Modal show={showReviewsModal} onHide={() => showRevFromParent(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Reviews</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h1>Reviews</h1>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => showRevFromParent(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default ReviewsModal;