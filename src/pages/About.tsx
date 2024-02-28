import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

export function About() {
  return (
    <Container className="about-container">
      <h1 className="text-center about-header">About Us</h1>
      <Row className="about-section">
        <Col className="section section-create">
          <h2>Create and Share Your Courses</h2>
          <p>Our platform enables educators and enthusiasts alike to create and upload their own courses, sharing their knowledge and passion with the world. Whether you're an expert in coding, a master chef, or a yoga instructor, this is the place for you to spread your wisdom and make a positive impact on learners across the globe.</p>
        </Col>
      </Row>
      <Row className="about-section">
        <Col className="section section-engage">
          <h2>Engage with a Community of Learners</h2>
          <p>Connect with learners from around the world. Our platform is not just about learning; it's about building a community. Receive and give feedback through course reviews, participate in discussions, and improve the learning experience for everyone involved. Your insights can help others achieve their goals while also allowing you to refine your courses based on direct feedback.</p>
        </Col>
      </Row>
      <Row className="about-section">
        <Col className="section section-register">
          <h2>Easy Registration Process</h2>
          <p>Joining our community is straightforward and simple. In just a few steps, you can start learning or teaching. Our platform is designed to be as accessible as possible, ensuring that anyone eager to learn or share knowledge can do so without unnecessary barriers. Start your journey with us today and see where it takes you!</p>
        </Col>
      </Row>
    </Container>
  );
}
