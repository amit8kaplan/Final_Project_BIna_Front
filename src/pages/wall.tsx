import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ViewDapit from '../components/view_Dapit'; // Assuming you have a ViewDapit component
import { SideBarWall } from '../components/sidebar_wall';


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
        <div>
            <SideBarWall img="https://via.placeholder.com/150" name="John Doe" age={30} job="Pilot" personalInstructor="Jane Doe" avgGrade={90} />
        </div>
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
    </div>
  );
};

export default Wall;
