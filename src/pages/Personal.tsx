import React, { useEffect, useState } from "react";
import { fetchUser } from "../services/personal-service";
import { fetchReviewsByUserID } from "../services/reviews-serivce"; // Make sure this service is implemented
import { Card, Button, Modal, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Personal: React.FC = () => {
  const [userData, setUserData] = useState<any>(null); // State to hold user data
  const [userReviews, setUserReviews] = useState([]); // Add this line
  const [showModal, setShowModal] = useState(false);
  const [showUserReviewsModal, setShowUserReviewsModal] = useState(false); // Add this line
  const [newUserData, setNewUserData] = useState({
    userName: "",
    email: "",
    password: "",
    imgUrl: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserfromServer();
  }, []);

  const fetchUserfromServer = async () => {
    const data = await fetchUser();
    setUserData(data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Updated User Data:", newUserData);
    setShowModal(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewUserData({});
  };

  const handleSaveChanges = () => {
    setUserData(newUserData);
    setShowModal(false);
  };

  const handleMyReviewsClick = async () => {
    const userId = userData._id; // Update this line to use your actual logic for getting the current user's ID
    const reviews = await fetchReviewsByUserID(userId);
    setUserReviews(reviews);
    setShowUserReviewsModal(true);
  };

  const navToMyCourses = () => {
    navigate("/personal/my-courses");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
      <div style={{ marginBottom: "20px" }}>
        <Button onClick={navToMyCourses} variant="primary" style={{ width: "150px", marginRight: "10px" }}>My Courses</Button>
        <Button variant="primary" style={{ width: "150px" }} onClick={handleMyReviewsClick}>My Reviews</Button>
      </div>

      {userData && (
        <Card style={{ width: "400px", backgroundColor: "#f8f9fa", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
          <Card.Body>
            <Card.Title className="text-center mb-4">Personal Info</Card.Title>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img src={userData.imgUrl} alt="User" style={{ width: "300px", height: "auto", borderRadius: "10px" }} />
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <p><strong>Name:</strong> {userData.userName}</p> {/* Make sure the property names match your userData object structure */}
                <p><strong>Email:</strong> {userData.email}</p>
              </div>
              <Button variant="primary" onClick={() => setShowModal(true)} style={{ marginTop: "20px" }}>Change Info</Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Modal for changing user information */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Change Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* User information form */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Add a Modal here to display and potentially edit user reviews */}
      <Modal show={showUserReviewsModal} onHide={() => setShowUserReviewsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>My Reviews</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Loop through userReviews to display them */}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Personal;
