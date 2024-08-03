// PostCard.tsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { set } from 'react-hook-form';
import { FaEye, FaComment } from 'react-icons/fa';
 import ViewPost  from '../components/view_Post'; // Assuming you have a ViewPost component
import {dateOnly} from '../services/dapit-serivce';
import { getWall, IPostforSubmit, postPost, getLikes, putLike, postLike , handleLike} from '../services/wall-service';
import LikeAndComment from './LikeAndComment';
interface ILikes {
    _id: string;
    idDapitOrPost: string;
    count: number;
}
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
    idTrainer: string | undefined;
}

const PostCard: React.FC<PostCardProps> = ({ post, idTrainer }) => {
    const [newDate, setNewDate] = useState<string | null>(null);
    useEffect(()=>{
        console.log('post: ', post);
        if (post.date !==null && post.date !== undefined) {
            setNewDate(dateOnly(post.date));
        }
        fetchLikes();
    }, [post]);
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [showViewPostModal, setShowViewPostModal] = useState(false);
    const [likes, setLikes] = useState<ILikes[]>([]);

    const fetchLikes = async () => {
        try {
            if (!idTrainer) {
                return;
            }
            const likes = await getLikes(idTrainer);
            console.log('likes: ', likes);
            setLikes(likes);
        } catch (error) {
            console.error('Error fetching likes:', error);
        }
    }

    const handleOpenViewPostModal = (post: any) => {
        console.log("post: ", post);
        handleLike(post._id, likes);
        fetchLikes();
        setSelectedPost(post);
        setShowViewPostModal(true);
    }
    const handleCloseViewPostModal = () => {
        setSelectedPost(null);
        setShowViewPostModal(false);
    };

    // const handleLike = async (idDapitOrPost: string) => {
    //     // console.log("handleLike: ", idDapitOrPost);
    //     // let flag = false
    //     // let count = 0
    //     // likes?.forEach((like: any) => {
    //     //     if (like.idDapitOrPost === idDapitOrPost) {
    //     //         flag = true;
    //     //         count = like.count;
    //     //     }
    //     // });
    //     // if (flag) {
    //     //     await putLike(idDapitOrPost, 'like', count);
    //     // }
    //     // if (!flag) {
    //     //     await postLike(idDapitOrPost);
    //     // }
    //     fetchLikes();
    // };
    const borderCol = () => {
        return { borderLeft: "1px dashed gray" }
    }
    return (
        <div><Card >
            <Card.Body>
                <Row>
                    <Col md={2} onClick={()=> handleOpenViewPostModal(post)}>
                        <Card.Subtitle className="mb-2 text-muted">{post.nameInstractor}</Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted">{newDate }</Card.Subtitle>
                    </Col>
                    <Col md={8} style={{...borderCol()}} onClick={()=> handleOpenViewPostModal(post)}>
                        <Card.Title>{post.title}</Card.Title>
                        <Card.Text>{post.content}</Card.Text>
                    </Col>
                    <Col md={2} style={{...borderCol()}}>
                            {/* <Row className='ms-2 pt-2'  >
                                <Col>
                                    <FaEye /> {getLikeCount(selectedDapit._id)}
                                </Col>
                            </Row>
                            <Row className='ms-2 pt-3'>
                                <Col >
                                        <FaComment className='CommentIconBtn' onClick={() => handleComment(selectedDapit._id, 'This is a comment')}/> 
                                </Col>
                            </Row> */}
                        <LikeAndComment id={post._id} likes={likes} />
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
