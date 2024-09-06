import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

interface SessionModalProps {
    show: boolean;
    onHide: () => void;
}

const SessionModal: React.FC<SessionModalProps> = ({ show, onHide }) => {
    
    
    // useEffect(() => {
    //     if (searchQuery && searchQuery.trim() !== '') {
    //       console.log("the search query is:" + searchQuery)
    //       fetchCoursesBySearch(searchQuery, selectedOption).then((res) => setCourses(res));
    //     } else {
    //       fetchData().then((res) => setCourses(res));
    //     }
    //     buyCourse ? setBuyCourse(false) : null;
    // }, [searchQuery, courseAdded, buyCourse]);



  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Custom Modal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Modal content goes here */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SessionModal;