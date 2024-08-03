import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { FaThumbsUp } from 'react-icons/fa';
import ViewDapit from '../components/view_Dapit'; // Assuming you have a ViewDapit component
import { dateOnly } from '../services/dapit-serivce';
import { getWall, IPostforSubmit, postPost, getLikes, putLike, postLike } from '../services/wall-service';

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
        setViewDapit(Dapit);
        setShowViewDapitModal(true);
    }

    const handleCloseViewDapitModal = () => {
        setViewDapit(null);
        setShowViewDapitModal(false);
    };

    const handleLike = async (idDapitOrPost: string) => {
        console.log("handleLike: ", idDapitOrPost);
        let flag = false;
        let count = 0;
        likes?.forEach((like: any) => {
            if (like.idDapitOrPost === idDapitOrPost) {
                flag = true;
                count = like.count;
            }
        });
        if (flag) {
            await putLike(idDapitOrPost, 'like', count);
        } else {
            await postLike(idDapitOrPost);
        }
        fetchLikes();
    };

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
            <Card>
                <Card.Body>
                    <Row>
                        <Col md={2} onClick={() => handleOpenViewDapitModal(selectedDapit)}>
                            <Card.Subtitle className="mb-2 text-muted">{selectedDapit.namePersonalInstractor}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">{newDate}</Card.Subtitle>
                        </Col>
                        <Col md={2} onClick={() => handleOpenViewDapitModal(selectedDapit)}>
                            <Card.Title>{selectedDapit.session}</Card.Title>
                            <Card.Text>silabus: {selectedDapit.silabus}</Card.Text>
                        </Col>
                        <Col md={2} onClick={() => handleOpenViewDapitModal(selectedDapit)}>
                            <Card.Text>finalGrade: {selectedDapit.finalGrade}</Card.Text>
                            <Card.Text>chance: {selectedDapit.changeTobeCommender}</Card.Text>
                        </Col>
                        <Col md={4} onClick={() => handleOpenViewDapitModal(selectedDapit)}>
                            <Card.Text>{selectedDapit.summerize}</Card.Text>
                        </Col>
                        <Col md={2}>
                            <Button variant="outline-primary" onClick={() => handleLike(selectedDapit._id)}>
                                <FaThumbsUp /> {getLikeCount(selectedDapit._id)}
                            </Button>
                            <Button variant="outline-secondary" onClick={() => handleComment(selectedDapit._id, 'This is a comment')}>Comment</Button>
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
