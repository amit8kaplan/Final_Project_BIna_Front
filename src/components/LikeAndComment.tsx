import { FaEye, FaComments , FaCommentMedical , FaFlag } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { changeFlag } from '../services/wall-service';
import AddCommnetModal from './AddCommentsModel';
import ViewComments from './ViewComments';
import { Icomment, putComment , postComment} from '../services/wall-service';
import { set } from 'react-hook-form';
interface ILikes {
    _id: string;
    idDapitOrPost: string;
    flag: boolean;
    count: number;
}
interface Icomments {
    comments: Array<{ personalName: string, content: string, date: Date, _id?: string }>;
    count: number;
    idDapitOrPost: string;
    _id?: string;
}
interface LikeAndCmProps {
    id: string;
    likes: ILikes[];
    comments: Icomments[];
    handleFlagComments: (flag:boolean) => void;
}

const LikeAndComment: React.FC<LikeAndCmProps> = ({ id, likes, comments, handleFlagComments = () => {} }) => {
    const [flag, setFlag] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [commentsCount, setCommentsCount] = useState<number>(0);
    const [showAddComment, setShowAddCommentModal] = useState(false);
    const [showComments, setShowComments] = useState(false);
    console.log("id ", id );
    console.log("ttt comments ", comments);
    useEffect(() => {

        const getLikeCount = () => {
            const like = likes.find(like => like.idDapitOrPost === id);
            return like ? like.count : 0;
        }
        // const getCommentCount = () => {
        //     console.log("getCommentCount: ", id);
        //     //console.log("getCommentCount: ", comments);
        //     let comment:any;
        //     comments.forEach(element => {
        //         if (element.idDapitOrPost == id) {
        //             console.log("ttt the id is: ", id);
        //             console.log("ttt the elemnt: ", element);
        //             comment = {...comment, element};
        //         }
        //     });
        //     if (comment === undefined) {
        //         return 0;
        //     }
        //     console.log("ttt comment: ", comment);
        //     //console.log("getCommentCount: ", comment.element.comments.length);
        //     return comment.element.comments.length
        // }
        const getCommentCount = () => {
            console.log("getCommentCount: ", id);
            
            let totalComments = 0;
        
            comments.forEach(element => {
                if (element.idDapitOrPost === id) {
                    console.log("Matching element found for id: ", id);
                    totalComments += element.comments.length;
                }
            });
        
            console.log("Total comments for id:", id, "is", totalComments);
            return totalComments;
        };
        
        setCommentsCount(getCommentCount());
        setLikeCount(getLikeCount());
    }, [likes, comments, id]);
  
    const handleOpenComments = () => {
        setShowComments((prevShowComments) => {
            const newShowComments = !prevShowComments;
            //console.log("handleOpenComments before: ", prevShowComments);
            //console.log("handleOpenComments after: ", newShowComments);
            handleFlagComments(newShowComments);
            return newShowComments;
        });
    };
    
    const handleAddComment = async (personalname: string, content: string) => {
        try {
            const existComment = comments.find(comment => comment.idDapitOrPost === id);
            if (existComment !== undefined) {
                await putComment(id, personalname, content);
            } else {
                await postComment(id, personalname, content);
            }
            // Update comments count after adding a comment
            setCommentsCount(prevCount => prevCount + 1);
            setShowAddCommentModal(false); // Close the modal after adding a comment
        } catch (error) {
            //console.error('Error adding comment:', error);
        }
    };
    return (
        <div>
            <div>
                <Row><h3></h3></Row>
                <Row className=''>
                    <Col className='btn' style={{ borderRight: "2px dashed gray", cursor: "default" }}>
                        <FaEye /> {likeCount}
                    </Col>
                    <Col className='btn' style={{ borderRight: "2px dashed gray" }}>
                        <FaCommentMedical className='CommentIconBtn' onClick={() => setShowAddCommentModal(true)} />
                    </Col>
                    <Col className='btn'>
                        <FaComments onClick={() => handleOpenComments()} />
                        {" " + commentsCount}
                    </Col>
                </Row>
            </div>
            <AddCommnetModal
                show={showAddComment}
                handleClose={() => setShowAddCommentModal(false)}
                handleSave={handleAddComment} />
        </div>
    );
};

export default LikeAndComment;
