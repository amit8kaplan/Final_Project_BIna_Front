import React, { useEffect, useState } from "react";
import { fetchUser } from "../services/personal-service";
import { Card, Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

const Personal: React.FC = () => {
  const [userData, setUserData] = useState<any>(null); // State to hold user data
  const [showModal, setShowModal] = useState(false);
  const [newUserData, setNewUserData] = useState({
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
    setUserData(data); // Set user data to state
    console.log("the user data is:", data);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Submit updated user data to the server
    // For demo purposes, simply log the updated data
    console.log("Updated User Data:", newUserData);
    setShowModal(false); // Close the modal after submission
  };
  const handleModalClose = () => {
    // Close the modal and reset newUserData
    setShowModal(false);
    setNewUserData({});
  };
  
  const handleSaveChanges = () => {
    // Here you can perform the logic to save the changes
    // For simplicity, let's just update the userData with newUserData
    setUserData(newUserData);
    setShowModal(false);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
      {userData && (
        <Card style={{ width: "400px", backgroundColor: "#f8f9fa", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}>
          <Card.Body>
            <Card.Title className="text-center mb-4">Personal</Card.Title>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <img src={`${userData.imgUrl}`} alt="User" style={{ width: "300px", height: "auto", borderRadius: "10px" }} />
              <div style={{ marginTop: "20px", textAlign: "center" }}>
                <p><strong>Name:</strong> {userData.user_name}</p>
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
          <div className="mb-3">
            <label htmlFor="userName" className="form-label">User Name</label>
            <input type="text" className="form-control" id="userName" value={newUserData.user_name || ""} onChange={(e) => handleInputChange(e, "user_name")} />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" className="form-control" id="email" value={newUserData.email || ""} onChange={(e) => handleInputChange(e, "email")} />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" id="password" value={newUserData.password || ""} onChange={(e) => handleInputChange(e, "password")} />
          </div>
          <div className="mb-3">
            <label htmlFor="newPhoto" className="form-label">New Photo</label>
            <div className="input-group">
              <input type="file" className="form-control" id="newPhoto" style={{ display: "none" }} />
              <label htmlFor="newPhoto" className="input-group-text"><FontAwesomeIcon icon={faImage} /></label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Personal;
