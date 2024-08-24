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
    const [showAddComment, setShowAddCommentModal] = useState(false);
    const [showComments, setShowComments] = useState(false);
    console.log("comments ", comments);
    const handleChangeFlag = async () => {
        console.log("handleChangeFlag: ", id);
        try {
            const res = await changeFlag(id);
            console.log("handleChangeFlag 3", res);
        } catch (error) {
            console.error('Error changing flag:', error);
        }
    }
    
    const getLikeCount = () => {
        console.log("getLikeCount: ", id);
        const like = likes.find(like => like.idDapitOrPost === id);
        return like ? like.count : 0;
    }
    const getCommentCount = () => {
        console.log("getCommentCount: ", id);
        console.log("getCommentCount: ", comments);
        let comment:any;
        comments.forEach(element => {
            if (element.idDapitOrPost === id) {
                console.log("getCommentCount: ", element);
                comment = {...comment, element};
            }
        });
        if (comment === undefined) {
            return 0;
        }
        console.log("getCommentCount: ", comment.element.comments.length);
        return comment.element.comments.length
    }

    const handleOpenComments = () => {
        setShowComments((prevShowComments) => {
            const newShowComments = !prevShowComments;
            console.log("handleOpenComments before: ", prevShowComments);
            console.log("handleOpenComments after: ", newShowComments);
            handleFlagComments(newShowComments);
            return newShowComments;
        });
    };
    const handleAddComment = async (personalname: string, content: string) => {
        // Handle comment here
        console.log("handleComment: ", id);
        try{ 

            const existComment = comments.find(comment => comment.idDapitOrPost === id);
            console.log("try1 existComment: ", existComment);
            if (existComment !== undefined) {
                await putComment(id, personalname, content);
            }
            else if(existComment === undefined){ 
                console.log("try1 postComment: ", id);
                await postComment(id, personalname, content);
            }

        }
        
        catch (error) {
            console.error('Error adding comment:', error);
        }

    };

    const styleFlag = () => {
        console.log("flag: ", flag);
        const like = likes.find(like => like.idDapitOrPost === id);
        if (like === undefined) {
            return { color: 'gray', cursor: 'none',visibility: 'hidden' };
        }
        console.log("likestyleFlag: ", like);
        if (like?.flag === true) {
            console.log("flag if: ", like.flag);
            return { color: 'red', cursor: 'pointer',visibility: 'visible' };
        }
        return { color: 'black', cursor: 'pointer',visibility: 'visible'  };
    }

    return (
        <div>
            <div>
                <Row><h3></h3></Row>
                <Row className=''>
                    <Col className = 'btn' style={{borderRight: "2px dashed gray", cursor: "default"}}>
                        <FaEye /> {getLikeCount()}
                    </Col>
                {/* </Row>
                <Row className=''> */}
                    <Col className='btn' style={{borderRight: "2px dashed gray"}}>
                        <FaCommentMedical  className='CommentIconBtn' onClick={() => setShowAddCommentModal(true)} />
                        
                    </Col>
                    <Col className='btn' >
                        <FaComments
                            onClick={() => handleOpenComments()}
                        />
                        {" " +getCommentCount()}
                    </Col>
                </Row>
               
            </div>
         
            <AddCommnetModal 
            show ={showAddComment}
            handleClose={() => setShowAddCommentModal(false)}
            handleSave={handleAddComment}/>
            </div>
        );
};

export default LikeAndComment;
