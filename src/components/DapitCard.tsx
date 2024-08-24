import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { FaEye, FaComment } from 'react-icons/fa';
import ViewDapit from '../components/view_Dapit'; // Assuming you have a ViewDapit component
import { dateOnly } from '../services/dapit-serivce';
import { getComments, getWall, IPostforSubmit, postPost, getLikes, putLike, postLike, handleLike } from '../services/wall-service';
import LikeAndComment from './LikeAndComment';
import ViewComments from './ViewComments';

interface IData {
    value: number;
    description: string;
}

interface ILikes {
    _id: string;
    flag: boolean;
    idDapitOrPost: string;
    count: number;
}
interface Icomments {
    comments: Array<{ personalName: string, content: string, date: Date, _id?: string }>;
    count: number;
    idDapitOrPost: string;
    _id?: string;
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
    const [comments, setComments] = useState<Icomments[]>([]);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        console.log('Dapit: ', selectedDapit);
        if (selectedDapit.date !== null && selectedDapit.date !== undefined) {
            setNewDate(dateOnly(selectedDapit.date));
        }
        fetchLikes();
        fetchComments();
    }, [selectedDapit, showComments]);

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
    const handleAddLike = (dapit: any) => {
        console.log("handleAddLike: ", dapit._id);
        handleLike(dapit._id, likes);
        fetchLikes();
    }
    const fetchComments  = async () => {
        try {
            if (!idTrainer) {
                return;
            }
            const comments = await getComments(idTrainer);
            console.log('fetchComments Dapit: ', comments);
            setComments(comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
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
        fetchComments();
    };


    const getLikeCount = (idDapitOrPost: string) => {
        console.log("getLikeCount: ", idDapitOrPost);
        const like = likes.find(like => like.idDapitOrPost === idDapitOrPost);
        return like ? like.count : 0;
    }
    const handleFlginPostCard = () => {
        fetchLikes();
        fetchComments();
    }
    const handleFlagComments = (flag: boolean) => {
        console.log("handleOpenComments in handleFlagComments at PostCard: ", flag);
        setShowComments(flag);
    };
    const borderCol = () => {
        return { borderLeft: "1px dashed gray" }
    }
    const borderCard = (value: number) => {
    if (!value) {
        return {}; // Return default style when no value is present (e.g., on backspace)
      }
      else if (value === 10) return { backgroundColor: 'forestgreen', color: 'black' };
      else if (value === 9) return { backgroundColor: 'limegreen', color: 'black' };
      else if (value === 8) return { backgroundColor: 'lightgreen', color: 'black' };
      else if (value === 7) return { backgroundColor: 'silver', color: 'black' };
      else if (value === 6) return { backgroundColor: 'khaki' };
      else if (value === 5) return { backgroundColor: 'lightpink' };
      else if (value === 4) return { backgroundColor: 'lightcoral' };
    
      return {};
    };
    const cursorpointer =() => {
        return { cursor: "pointer" }
    }
    const opacity = () => {
        return { opacity: "0.3" }
    }
    return (
        <div>
            <Card style={{border: "double",  ...borderCard(selectedDapit?.finalGrade)}}>
                <Card.Body>
                    <Row>
                        <Col md={2} onClick={() => handleOpenViewDapitModal(selectedDapit)} style={{ ...showComments ? opacity() : {}, ...cursorpointer()}}>
                            <Card.Subtitle className="mb-2 text-muted">{selectedDapit.namePersonalInstractor}</Card.Subtitle>
                            <Card.Subtitle className="mb-2 text-muted">{newDate}</Card.Subtitle>
                        </Col>
                        <Col md={2} style={{...borderCol(), ...cursorpointer(), ...(showComments ? { opacity: "0.3" } : {})}} onClick={() => handleOpenViewDapitModal(selectedDapit)}>
                            <Card.Title>{selectedDapit.session}</Card.Title>
                            <Card.Text>silabus: {selectedDapit.silabus}</Card.Text>
                        </Col>
                        <Col md={2} style={{...borderCol(), ...cursorpointer(), ...(showComments ? { opacity: "0.3" } : {})}} onClick={() => handleOpenViewDapitModal(selectedDapit)}>
                            <Card.Text>finalGrade: {selectedDapit.finalGrade}</Card.Text>
                            <Card.Text>chance: {selectedDapit.changeTobeCommender}</Card.Text>
                        </Col>
                        <Col md={4} style={{...borderCol(), ...cursorpointer(), ...(showComments ? { opacity: "0.3" } : {})}} onClick={() => handleOpenViewDapitModal(selectedDapit)}>
                            <Card.Text>{selectedDapit.summerize}</Card.Text>
                        </Col>
                        <Col md={2} style={{...borderCol(), margin: '0'}}>

                            <LikeAndComment id={selectedDapit._id} likes={likes} comments ={comments} handleFlagComments={handleFlagComments} />
                        </Col>
                    </Row>
                </Card.Body>
            <div >
                {showComments && (
                    <div>
                        <h5>Comments</h5>
                        <ViewComments idDapitOrPost={selectedDapit._id} comments={comments} />
                        </div>
                )}
            </div>
            </Card>
            {viewDapit && (
                <ViewDapit selectedDapit={viewDapit} onClose={handleCloseViewDapitModal} />
            )}
        </div>
    );
};

export default DapitCard;
