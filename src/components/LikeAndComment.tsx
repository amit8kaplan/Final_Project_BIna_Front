import { FaEye, FaComment, FaFlag } from 'react-icons/fa';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import React, { useEffect, useState } from 'react';
import { changeFlag } from '../services/wall-service';

interface ILikes {
    _id: string;
    idDapitOrPost: string;
    flag: boolean;
    count: number;
}
interface LikeAndCmProps {
    id: string;
    likes: ILikes[];
    handleFlag: () => void;
}

const LikeAndComment: React.FC<LikeAndCmProps> = ({ id, likes, handleFlag }) => {
    const [flag, setFlag] = useState<boolean>(false);

    const handleChangeFlag = async () => {
        console.log("handleChangeFlag: ", id);
        try {
            const res = await changeFlag(id);
            console.log("handleChangeFlag 3", res);
            handleFlag();
        } catch (error) {
            console.error('Error changing flag:', error);
        }
    }

    const getLikeCount = () => {
        console.log("getLikeCount: ", id);
        const like = likes.find(like => like.idDapitOrPost === id);
        return like ? like.count : 0;
    }

    const handleComment = async (DapitId: string, comment: string) => {
        // Handle comment here
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
            <Row className='ms-2 pt-1'>
                <Col>
                    <FaEye /> {getLikeCount()}
                </Col>
            </Row>
            <Row className='ms-2 pt-1'>
                <Col>
                    <FaComment className='CommentIconBtn' onClick={() => handleComment(id, 'This is a comment')} />
                </Col>
            </Row>
            <Row className='ms-2  justify-content-end'>
            <Col xs="auto" style={{borderStyle: 'outset' }}>
                <FaFlag
                        style={{ ...styleFlag(), fontSize: '0.8em' }}
                        onClick={() => handleChangeFlag()}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default LikeAndComment;
