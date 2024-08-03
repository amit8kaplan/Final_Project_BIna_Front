import { FaEye, FaComment } from 'react-icons/fa';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import exp from 'constants';

interface ILikes {
    _id: string;
    idDapitOrPost: string;
    count: number;
}
interface LikeAndCmProps {
    id : string;
    likes: ILikes[];
}


const LikeAndComment: React.FC<LikeAndCmProps> = ({id, likes}) => {

const getLikeCount = (idDapitOrPost: string) => {
    console.log("getLikeCount: ", idDapitOrPost);
    const like = likes.find(like => like.idDapitOrPost === idDapitOrPost);
    return like ? like.count : 0;
}
const handleComment = async (DapitId: string, comment: string) => {
    // Handle comment here
};
return (
<div>
    <Row className='ms-2 pt-2'  >
        <Col>
            <FaEye /> {getLikeCount(id)}
        </Col>
    </Row>
    <Row className='ms-2 pt-3'>
        <Col >
            {/* <Button variant="shadow-none" o> */}
                <FaComment className='CommentIconBtn' onClick={() => handleComment(id, 'This is a comment')}/> 
            {/* </Button> */}
        </Col>
    </Row>
</div>
)};

export default LikeAndComment;