import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import ViewDapit from '../components/view_Dapit'; // Assuming you have a ViewDapit component
import { SideBarWall } from '../components/sidebar_wall';
import { trainersData, sessionsData, categoriesData, silabusPerSessionData } from '../public/data';
import { getTrainerByname } from '../services/id-service';
import { getWall, IPostforSubmit, postPost } from '../services/wall-service';
import AddPostModal from '../components/AddPostModel';
import PostCard from '../components/PostCard';

interface IWallProps {
    trainerName: string;
}

export interface ITrainer {
    name: string;
    _id: string;
}

const Wall: React.FC<IWallProps> = (props) => {
    const location = useLocation();
    const state = location.state as IWallProps || {};
    const trainerName = state.trainerName || props.trainerName;

    const [TrainerId, setTrainerId] = useState<string | undefined>();
    const [wallData, setWallData] = useState<any[]>([]);
    const [showAddPostModal, setShowAddPostModal] = useState(false);
    const [selectedDapit, setSelectedDapit] = useState<any | null>(null);
    const [showDapitModal, setShowDapitModal] = useState(false);

    useEffect(() => {
        fetchWallData();
    }, [trainerName]);

    const fetchWallData = async () => {
        try {
            const TrainerData = await getTrainerByname(trainerName);
            setTrainerId(TrainerData[0]._id);

            const wallData = await getWall(TrainerData[0]._id);
            setWallData(wallData);
        } catch (error) {
            console.error('Error fetching TrainerData:', error);
        }
    };

    const handleAddPost = async (title: string, text: string, instractorName: string) => {
        try {
            const submitPost: IPostforSubmit = {
                idTrainer: TrainerId,
                idInstractor: TrainerId,
                nameInstractor: instractorName,
                title: title,
                content: text,
                date: new Date(),
            };
            await postPost(submitPost);
            fetchWallData();
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    const handleLike = async (postId: string) => {
        // Handle like here
    };

    const handleComment = async (postId: string, comment: string) => {
        // Handle comment here
    };

    const handleOpenDapitModal = (dapit: any) => {
        setSelectedDapit(dapit);
        setShowDapitModal(true);
    };

    const handleOpenPostModal = (post: any) => {
        // Handle opening post modal here
    }

    const handleCloseDapitModal = () => {
        setSelectedDapit(null);
        setShowDapitModal(false);
    };

    return (
        <Container>
            <Row className="mb-3">
                <Col>
                    <Button onClick={() => setShowAddPostModal(true)}>Add Post</Button>
                </Col>
            </Row>
            <Row>
                {wallData.map((item, index) => (
                    <Col key={index} md={12} className="mb-3">
                     <div>
                        {item.title !== undefined || item.content !== undefined ? (
                            <PostCard post={item} />
                        ) : null}
                    </div>
                        {/* <Card onClick={() => item.type === 'dapit' && handleOpenDapitModal(item)}>
                            <Card.Body>
                                <Row>
                                    <Col md={2}>
                                        {item.title === undefined ? (
                                            <Button variant="link" onClick={() => handleOpenDapitModal(item)}>View Dapit</Button>)
                                            : <Button variant="link" onClick={() => handleOpenPostModal(item)}>View Post</Button>}
                                    </Col>
                                    <Col md={8}>
                                        <Card.Title>{item.title !== undefined ? item.title : `Session: ${item.session}`}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            {item.type === 'post' ? `Instructor: ${item.instructorName}` : `Syllabus: ${item.syllabus}`}
                                        </Card.Subtitle>
                                        <Card.Text>
                                            {item.type === 'post' ? item.mainText : `Final Grade: ${item.finalGrade}`}
                                        </Card.Text>
                                 
                                    </Col>
                                    <Col md={2} className="text-center">
                                        
                                        <Button variant="outline-primary" onClick={() => handleLike(item.id)}>Like</Button>
                                        <Button variant="outline-secondary" onClick={() => handleComment(item.id, 'This is a comment')}>Comment</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card> */}
                    </Col>
                ))}
            </Row>

            <AddPostModal
                show={showAddPostModal}
                handleClose={() => setShowAddPostModal(false)}
                handleSave={handleAddPost}
            />

            
                    {selectedDapit && (
                        <ViewDapit selectedDapit={selectedDapit} onClose={handleCloseDapitModal} />
                    )}
        </Container>
    );
};

export default Wall;
