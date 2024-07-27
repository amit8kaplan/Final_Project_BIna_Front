import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface IPostProps{
    selectedPost:{
        _id: string;
        idTrainer?: string;
        idInstractor?: string;
        nameInstractor?: string;
        title?: string;
        content?: string;
        date?: string;
    };
    handleClose: ()=>void;
}

const ViewPost: React.FC<IPostProps> = ({selectedPost, handleClose}) => {
    useEffect(()=>{
        console.log('selectedPost: ', selectedPost);
    }, [selectedPost]);

    return (
        <Modal show={true} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{selectedPost.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{selectedPost.nameInstractor}</p>
                <p>{selectedPost.content}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ViewPost;
