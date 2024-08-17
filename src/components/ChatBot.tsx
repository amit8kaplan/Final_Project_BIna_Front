import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaSearch  } from 'react-icons/fa';
import { postChat } from '../services/ai-service';





const ChatBotModal: React.FC = () => {
    const [show, setShow] = useState(false);
    const [question, setQuestion] = useState<string>('');
    const handleClose = () => {
        setQuestion('');
        setShow(false);
    };
    const handleShow = () => setShow(true);
    const handleSubmit = async () => {
        console.log('Message sent');
        try {
            console.log("question", question);
            const res = await postChat(question);
            console.log('res:', res);   
        }
        catch (error) {
            console.error('Error sending message:', error);
        }
        handleClose();
    };
    return (
        <>
            <Button variant="light" onClick={handleShow} style={{ marginLeft: 'auto' }}>
                <FaSearch />
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>BinaGPT</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Chat content goes here */}
                    <p>Hello! I'm ready to provide expert knowledge to help the trainer succeed</p>

                    <Form.Control type="text" placeholder="Type a question..." value={question}  onChange={e => setQuestion(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Send
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ChatBotModal;
