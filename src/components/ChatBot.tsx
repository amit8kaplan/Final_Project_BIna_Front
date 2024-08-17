import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { postChat } from '../services/ai-service';

const ChatBotModal: React.FC = () => {
    const [show, setShow] = useState(false);
    const [question, setQuestion] = useState<string>('');
    const [response, setResponse] = useState<string>('Last Q: N/A\nLast A: N/A');
    const [fullResponse, setFullResponse] = useState<string>('');
    const responseRef = useRef<string>('');  // To store the ongoing response

    const handleClose = () => {
        setQuestion('');
        setShow(false);
    };

    const handleShow = () => setShow(true);

    const typeText = (text: string) => {
        let index = 0;
        responseRef.current = '';  // Reset the responseRef

        const interval = setInterval(() => {
            if (text[index] !== undefined) {  // Ensure there's a character to add
                responseRef.current += text[index];
                setResponse(responseRef.current);
            }
            index++;

            if (index === text.length) {
                clearInterval(interval);
            }
        }, 50);
    };

    const handleSubmit = async () => {
        console.log('Message sent');
        try {
            console.log("question", question);
            const res = await postChat(question);
            console.log('res:', res);

            if (res && res.response) {
                setFullResponse(`Last Q: ${question}\nLast A: ${res.response}`);
                typeText(res.response);
            } else {
                setResponse('Error: No response from server');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setResponse('Error: Could not send message');
        }
    };

    useEffect(() => {
        setResponse(fullResponse);
    }, [show]);

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
                    <p>Hello! I'm ready to provide expert knowledge to help the trainer succeed</p>
                    <div style={{ display: 'flex' }}>
                        <Form.Control
                            type="text"
                            placeholder="Type a question..."
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            style={{ marginRight: '10px' }}
                        />
                        <Button variant="primary" onClick={handleSubmit}>
                            Send
                        </Button>
                    </div>
                    <hr />
                    <h5>Response:</h5>
                    <p style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{response}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ChatBotModal;
