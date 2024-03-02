// import { Button, Modal } from "react-bootstrap";
// const [reviews, setReviews] = useState<IcourseReview[]>([]);
// const [showReviewsModal, setShowReviewsModal] = useState(false);
// const fetchReviews = async (courseId: string) => {
//     try {
//       const response = await apiClient.get(`/courseReviews/${courseId}`);
//       setReviews(response.data);
//       setShowReviewsModal(true);
//     } catch (error) {
//       console.error('Error fetching reviews:', error);
//     }
//   };
  
// export const ReviewsModal: React.FC<{ show: boolean, onHide: () => void, courseName: string }> = ({ show, onHide, courseName }) => {
//     return (
//       <Modal show={show} onHide={onHide}>
//         <Modal.Header closeButton>
//           <Modal.Title>Reviews for {courseName}</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {/* Display reviews here */}
//           {reviews.map(review => (
//             <div key={review._id}>
//               <h5>{review.owner_name}</h5>
//               <p>{review.message}</p>
//             </div>
//           ))}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={onHide}>Close</Button>
//           <Button variant="primary">Add a Review</Button>
//         </Modal.Footer>
//       </Modal>
//     );
//   };
  