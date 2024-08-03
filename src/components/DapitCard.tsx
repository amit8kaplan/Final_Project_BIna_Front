import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { FaEye, FaComment } from 'react-icons/fa';
import ViewDapit from '../components/view_Dapit'; // Assuming you have a ViewDapit component
import { dateOnly } from '../services/dapit-serivce';
import { getWall, IPostforSubmit, postPost, getLikes, putLike, postLike, handleLike } from '../services/wall-service';
import LikeAndComment from './LikeAndComment';
interface IData {
    value: number;
    description: string;
}

interface ILikes {
    _id: string;
    idDapitOrPost: string;
    count: number;
}

interface IDapitProps {
    selectedDapit: {
        _id: string;
        nameInstractor: string;
        namePersonalInstractor: string;
        nameTrainer: string;
        group: string;
        session?: string;
        silabus: number;
        date: string;
        tags: string[];
        identification: IData[];
        payload: IData[];
        decryption: IData[];
        workingMethod: IData[];
        understandingTheAir: IData[];
        flight: IData[];
        theoretical: IData[];
        thinkingInAir: IData[];
        safety: IData[];
        briefing: IData[];
        debriefing: IData[];
        debriefingInAir: IData[];
        implementationExecise: IData[];
        dealingWithFailures: IData[];
        dealingWithStress: IData[];
        makingDecisions: IData[];
        pilotNature: IData[];
        crewMember: IData[];
        advantage: string[];
        disavantage: string[];
        summerize: string;
        finalGrade: number;
        changeTobeCommender: number;
    };
    idTrainer: string | undefined;
}

const DapitCard: React.FC<IDapitProps> = ({ selectedDapit, idTrainer }) => {
    const [newDate, setNewDate] = useState<string | null>(null);
    const [likes, setLikes] = useState<ILikes[]>([]);
    
    useEffect(() => {
        console.log('Dapit: ', selectedDapit);
        if (selectedDapit.date !== null && selectedDapit.date !== undefined) {
            setNewDate(dateOnly(selectedDapit.date));
        }
        fetchLikes();
    }, [selectedDapit]);

    const [viewDapit, setViewDapit] = useState<any | null>(null);
    const [showViewDapitModal, setShowViewDapitModal] = useState(false);

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

    const handleOpenViewDapitModal = (Dapit: any) => {
        console.log("Dapit: ", Dapit);
        handleLike(Dapit._id, likes);
        fetchLikes();
        setViewDapit(Dapit);
        setShowViewDapitModal(true);
    }

    const handleCloseViewDapitModal = () => {
        setViewDapit(null);
        setShowViewDapitModal(false);
    };

    // const handleLike = async (idDapitOrPost: string) => {
    //     console.log("handleLike: ", idDapitOrPost);
    //     let flag = false;
    //     let count = 0;
    //     likes?.forEach((like: any) => {
    //         if (like.idDapitOrPost === idDapitOrPost) {
    //             flag = true;
    //             count = like.count;
    //         }
    //     });
    //     if (flag) {
    //         await putLike(idDapitOrPost, 'like', count);
    //     } else {
    //         await postLike(idDapitOrPost);
    //     }
    //     fetchLikes();
    // };

    const getLikeCount = (idDapitOrPost: string) => {
        console.log("getLikeCount: ", idDapitOrPost);
        const like = likes.find(like => like.idDapitOrPost === idDapitOrPost);
        return like ? like.count : 0;
    }

    const handleComment = async (DapitId: string, comment: string) => {
        // Handle comment here
    };
    const borderCol = () => {
        return { borderLeft: "1px dashed gray" }
    }
    const borderCard = (value: number) => {
        if (value === undefined || value === 7) return;
        if (value === 10) return { border: "2px solid green", backgroundColor: "honeyDew" }
        if (value === 9) return { border: "2px solid green", backgroundColor: "honeyDew" }
        if (value === 8) return { border: "2px solid darkseagreen", backgroundColor: "honeyDew" }
        if (value === 6) return { border: "2px solid yellow", backgroundColor: "lightyellow" }
        if (value === 5) return { border: "2px solid red", backgroundColor: "lightcoral" }
        if (value === 4) return { border: "2px solid red", backgroundColor: "lightcoral" }
    }
    return (
        <div>
            <Card style={{...borderCard(selectedDapit?.finalGrade)}}>
                <Card.Body>
                    <Row>
                        <Col md={2} onClick={() => handleOpenViewDapitModal(selectedDapit)}>
                            <Card.Subtitle className="mb-2 text-muted">{selectedDapit.namePersonalInstractor}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">{newDate}</Card.Subtitle>
                        </Col>
                        <Col md={2} style={{...borderCol()}} onClick={() => handleOpenViewDapitModal(selectedDapit)}>
                            <Card.Title>{selectedDapit.session}</Card.Title>
                            <Card.Text>silabus: {selectedDapit.silabus}</Card.Text>
                        </Col>
                        <Col md={2} style={{...borderCol()}} onClick={() => handleOpenViewDapitModal(selectedDapit)}>
                            <Card.Text>finalGrade: {selectedDapit.finalGrade}</Card.Text>
                            <Card.Text>chance: {selectedDapit.changeTobeCommender}</Card.Text>
                        </Col>
                        <Col md={4} style={{...borderCol()}} onClick={() => handleOpenViewDapitModal(selectedDapit)}>
                            <Card.Text>{selectedDapit.summerize}</Card.Text>
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
                            <LikeAndComment id={selectedDapit._id} likes={likes} />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            {viewDapit && (
                <ViewDapit selectedDapit={viewDapit} onClose={handleCloseViewDapitModal} />
            )}
        </div>
    );
};

export default DapitCard;
