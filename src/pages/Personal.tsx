import React, { useEffect, useState } from "react";
import { fetchUser, updateUserDetails } from "../services/personal-service";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";


// Define a type for your user data that allows imgUrl to be a string or a File
type NewUserData = {
  userName: string;
  email: string;
  password: string;
  imgUrl: string | File;
};

const Personal: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [newUserData, setNewUserData] = useState<NewUserData>({
    userName: "",
    email: "",
    password: "",
    imgUrl: "",
  });

  useEffect(() => {
    fetchUserfromServer();
  }, []);

  const fetchUserfromServer = async () => {
    const data = await fetchUser();
    setUserData(data); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewUserData((prevUserData) => ({
      ...prevUserData,
      [id]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewUserData((prevUserData) => ({
        ...prevUserData,
        imgUrl: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("userName", newUserData.userName);
    formData.append("email", newUserData.email);
    formData.append("password", newUserData.password); // Ensure secure handling of passwords

    if (newUserData.imgUrl instanceof File) {
      formData.append("imgUrl", newUserData.imgUrl);
    }

    try {
      const updatedUser = await updateUserDetails(userData._id, formData); // This function must be defined in your personal-service file
      setUserData(updatedUser); // Update the user data state
      setShowModal(false); // Close the modal after a successful update
    } catch (error) {
      console.error("Failed to update user:", error);
      // Here you can add some UI feedback for the error
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewUserData({ userName: "", email: "", password: "", imgUrl: "" }); // Reset the modal form
  };

  const navigate = useNavigate();
  const navToMyCourses = () => navigate("/personal/my-courses");
  const navToMyReviews = () => navigate("/personal/my-reviews");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "50px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <Button
          onClick={navToMyCourses}
          variant="primary"
          style={{ width: "150px", marginRight: "10px" }}
        >
          My Courses
        </Button>
        <Button
          onClick={navToMyReviews}
          variant="primary"
          style={{ width: "150px" }}
        >
          My Reviews
        </Button>
      </div>

      {userData && (
        <Card
          style={{
            width: "400px",
            backgroundColor: "#f8f9fa",
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Card.Body>
            <Card.Title className="text-center mb-4">Personal Info</Card.Title>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={
                  typeof newUserData.imgUrl === "string"
                    ? newUserData.imgUrl
                    : URL.createObjectURL(newUserData.imgUrl)
                }
                alt="User"
                style={{ width: "300px", height: "auto", borderRadius: "10px" }}
              />
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <p>
                  <strong>Name:</strong> {userData.userName}
                </p>
                <p>
                  <strong>Email:</strong> {userData.email}
                </p>
              </div>
              <Button
                variant="primary"
                onClick={() => setShowModal(true)}
                style={{ marginTop: "20px" }}
              >
                Change Info
              </Button>
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
          <Form.Group className="mb-3">
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              id="userName"
              value={newUserData.userName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              id="email"
              value={newUserData.email}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              id="password"
              value={newUserData.password}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>New Photo</Form.Label>
            <div className="input-group">
              <Form.Control
                type="file"
                id="newPhoto"
                onChange={handleFileChange}
              />
              {/* <Form.Label className="input-group-text" htmlFor="newPhoto">
                <FontAwesomeIcon icon={faImage} /> Upload
              </Form.Label> */}
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Personal;
