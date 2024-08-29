// PostCard.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { set } from 'react-hook-form';
import { FaEye, FaComment } from 'react-icons/fa';
 import ViewPost  from '../components/view_Post'; // Assuming you have a ViewPost component
import {dateOnly} from '../services/dapit-serivce';
import { getWall, IPostforSubmit, postPost, getLikes,getComments, putLike, postLike , handleLike} from '../services/wall-service';
import LikeAndComment from './LikeAndComment';
import ViewComments from './ViewComments';
interface ILikes {
    _id: string;
    flag: boolean;
    idDapitOrPost: string;
    count: number;
}
interface Icomments{
    comments: Array<{ personalName: string, content: string, date: Date, _id?: string }>;
    count: number;
    idDapitOrPost: string;
    _id?: string;
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
    const contentRef = useRef<HTMLDivElement | null>(null);

    const [newDate, setNewDate] = useState<string | null>(null);
    const [showComments, setShowComments] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [showViewPostModal, setShowViewPostModal] = useState(false);
    const [likes, setLikes] = useState<ILikes[]>([]);
    const [comments, setComments] = useState<Icomments[]>([]);
    useEffect(()=>{
        //console.log('post: ', post);
        if (post.date !==null && post.date !== undefined) {
            setNewDate(dateOnly(post.date));
        }
        fetchLikes();
        fetchComments();
    }, [post, showComments]);

    const fetchLikes = async () => {
        try {
            if (!idTrainer) {
                return;
            }
            const likes = await getLikes(idTrainer);
            //console.log('likes: ', likes);
            setLikes(likes);
        } catch (error) {
            //console.error('Error fetching likes:', error);
        }
    }
    const fetchComments  = async () => {
        try {
            if (!idTrainer) {
                return;
            }
            const comments = await getComments(idTrainer);
            console.log('post id: ', post._id);
            console.log('comments of Post: ', comments);
            setComments(comments);
        } catch (error) {
            //console.error('Error fetching comments:', error);
        }
    }

    const handleOpenViewPostModal = (post: any) => {
        //console.log("post: ", post);
        handleLike(post._id, likes);
        fetchLikes();
        setSelectedPost(post);
        setShowViewPostModal(true);
    }
    const handleAddLike = (post: any) => {
        //console.log("handleAddLike: ", post._id);
        if (!showComments) {
            handleLike(post._id, likes);
            fetchLikes();
        }
    }
    const handleCloseViewPostModal = () => {
        setSelectedPost(null);
        setShowViewPostModal(false);
        fetchComments();

    };
    const handleFlginPostCard = () => {
        fetchLikes();
        fetchComments();

    }
    const handleLieksInLikeAndComment = () => {
        if (!showComments) {
            handleLike(post._id, likes);
            fetchLikes();
        }
    }
    const handleFlagComments = (flag: boolean) => {
        //console.log("handleOpenComments in handleFlagComments at PostCard: ", flag);
        setShowComments(flag);
    };
    const borderCol = () => {
        return { borderLeft: "1px dashed gray" }
    }
    const borderComments = () => {
        return { borderBottom: "1px dashed gray" }
    }
    const MainCardBodyStyle = () => {
        return { 
            backgroundColor: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        };    }
    const cursorpointer =() => {
        return { cursor: "pointer" }
    }
    return (
        <div >
                <Card style={ {border: "double"}}>
                    <Card.Body  >
                        <Row>
                            <Col 
                                md={2} 
                                onClick={()=> handleOpenViewPostModal(post)} 
                                style={{
                                    ...(showComments ? { opacity: "0.3"} : {}),
                                    ...cursorpointer()
                                }}
                                    >
                                <Card.Subtitle className="mb-2 text-muted">{post.nameInstractor}</Card.Subtitle>
                                <Card.Subtitle className="mb-2 text-muted">{newDate }</Card.Subtitle>
                            </Col>
                            <Col md={8} 
                                style={{ 
                                    ...borderCol(), 
                                    ...(showComments ? { opacity: "0.3"} : {}),
                                    ...cursorpointer() 
                                }}   
                                onClick={()=> handleOpenViewPostModal(post)}>
                                <Card.Title>{post.title}</Card.Title>
                                <Card.Text>{post.content}</Card.Text>
                            </Col>
                            <Col md={2} style={{...borderCol()}} >
                                <LikeAndComment id={post._id} likes={likes} comments = {comments} handleFlagComments={handleFlagComments} />
                            </Col>
                        </Row>
                    
                     </Card.Body>
            <div >
                {showComments && (
                    <div>
                        <h5>Comments</h5>
                        <ViewComments idDapitOrPost={post._id} comments={comments} />
                        </div>
                )}
            </div>
        </Card>
        {selectedPost && (
            <ViewPost selectedPost = {selectedPost} handleClose={handleCloseViewPostModal} />
        )   }
        </div>
    );
};

export default PostCard;
