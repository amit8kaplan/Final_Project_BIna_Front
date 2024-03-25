import React, { useEffect, useRef, useState } from "react";
import { fetchUser, updateUserDetails } from "../services/personal-service";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

// Define a type for your user data that allows imgUrl to be a string or a File
type NewUserData = {
  user_name: string;
  email: string;
  password: string;
  imgUrl: string;
};

type UpdateUserExaptImg = {
  user_name: string;
  email: string;
  password: string;
  
};

const Personal: React.FC = () => {
  const fileInputRef = useRef(null);
  const [, setNewPhoto] = useState<File>(null); // New photo selected by the user
  const [userData, setUserData] = useState<UpdateUserExaptImg>({
    user_name: "",
    email: "",
    password: "",
    imgUrl: "",
  });
  const [showModal, setShowModal] = useState(false);

  const [newUserData, setNewUserData] = useState<NewUserData>({
    user_name: "",
    email: "",
    password: "",
    imgUrl: "",
  });

  useEffect(() => {
    fetchUserfromServer();
  }, [showModal]);

  const fetchUserfromServer = async () => {
    const data = await fetchUser();
    setUserData(data);
    setNewUserData({
      user_name: data.user_name,
      email: data.email,
      imgUrl: data.imgUrl,
      password: data.password,
    })
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewUserData((prevUserData) => ({
      ...prevUserData,
      [id]: value,
    }));
  };

  const imgSelected = (e: { target: { files: string | any[] } }) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setNewPhoto(file);
    }
  };

  const selectImg = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    try {
      console.log("newUserData: ", newUserData);
      const res = await updateUserDetails("1234567890", newUserData);
      console.log("res: ", res);
      // Close the modal after successful submission
      setUserData((prevUserData) => ({
        ...prevUserData,
        user_name: newUserData.user_name,
        email: newUserData.email,
        imgUrl: newUserData.imgUrl,
      }));
    } catch (error) {
      console.error("Error updating user:", error);
    }
    finally {
      handleModalClose();
    }
  };
  
  
  const handleModalClose = () => {
    setShowModal(false);
    setNewUserData({ user_name: "", email: "", imgUrl: "" }); // Reset the modal form
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
                  newUserData.imgUrl ||
                  userData.imgUrl ||
                  "https://via.placeholder.com/150" // Default placeholder image
                }
                alt="User"
                style={{ width: "300px", height: "auto", borderRadius: "10px" }}
              />
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <p>
                  <strong>Name:</strong> {userData.user_name}
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
              id="user_name"
              value={newUserData.user_name}
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
              // value={newUserData.password}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
  <Form.Label>New Photo</Form.Label>
  <div className="input-group">
    <input
      type="file"
      ref={fileInputRef}
      onChange={imgSelected}
      style={{ display: "none" }}
    />
    <button
      type="button"
      className="btn position-absolute bottom-0 end-0"
      onClick={selectImg}
    >
      <FontAwesomeIcon icon={faImage} className="fa-xl" />
    </button>
  </div>
  {newUserData.imgUrl && (
    <div style={{ marginTop: "10px" }}>
      <img
        src={newUserData.imgUrl}
        alt="Selected"
        style={{ maxWidth: "30%", height: "auto" }}
      />
    </div>
  )}
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
