import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavBar from './NavBar'; // Assuming you have a NavBar component
import ViewDapit from './ViewDapit'; // Assuming you have a ViewDapit component

const Wall = ({ trainerName, wallData }) => {
  const [selectedDapit, setSelectedDapit] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (dapit) => {
    setSelectedDapit(dapit);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedDapit(null);
    setShowModal(false);
  };

  return (
    <div>
      <NavBar />
      <Container>
        <Row>
          <Col>
            <h2>{trainerName}'s Wall</h2>
            {wallData.map((item, index) => (
              <Card key={index} className="mb-3">
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.content}</Card.Text>
                  <Button variant="primary" onClick={() => handleOpenModal(item)}>View Details</Button>
                </Card.Body>
              </Card>
            ))}
            <Button variant="secondary" className="mt-3">Load More</Button>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Dapit Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDapit && (
            <ViewDapit selectedDapit={selectedDapit} onClose={handleCloseModal} />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Wall;
