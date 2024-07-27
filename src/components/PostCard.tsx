// PostCard.tsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { set } from 'react-hook-form';
 import ViewPost  from '../components/view_Post'; // Assuming you have a ViewPost component
import {dateOnly} from '../services/dapit-serivce';


 interface PostCardProps {
    post: {
        _id: string;
        idTrainer?: string;
        idInstractor?: string;
        nameInstractor?: string;
        title?: string;
        content?: string;
        date?: string;
    };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const [newDate, setNewDate] = useState<string | null>(null);
    useEffect(()=>{
        console.log('post: ', post);
        if (post.date !==null && post.date !== undefined) {
            setNewDate(dateOnly(post.date));
        }
    }, [post]);
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [showViewPostModal, setShowViewPostModal] = useState(false);
    const handleOpenViewPostModal = (post: any) => {
        console.log("post: ", post);
        setSelectedPost(post);
        setShowViewPostModal(true);
    }
    const handleCloseViewPostModal = () => {
        setSelectedPost(null);
        setShowViewPostModal(false);
    };

    const handleLike = async (postId: string) => {
        // Handle like here
    };

    const handleComment = async (postId: string, comment: string) => {
        // Handle comment here
    };
    return (
        <div><Card onClick={()=> handleOpenViewPostModal(post)}>
            <Card.Body>
                <Row>
                    <Col md={2}>
                        <Card.Subtitle className="mb-2 text-muted">{post.nameInstractor}</Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted">{newDate }</Card.Subtitle>
                    </Col>
                    <Col md={8}>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.content}</Card.Text>
                    </Col>
                    <Col md={2}>
                        <Button variant="outline-primary" onClick={() => handleLike(post._id)}>Like</Button>
                        <Button variant="outline-secondary" onClick={() => handleComment(post._id, 'This is a comment')}>Comment</Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
        {selectedPost && (
            <ViewPost selectedPost = {selectedPost} handleClose={handleCloseViewPostModal} />
        )   }
        </div>
    );
};

export default PostCard;
