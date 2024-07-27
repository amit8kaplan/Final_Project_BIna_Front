import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import ViewDapit from '../components/view_Dapit'; // Assuming you have a ViewDapit component
import { SideBarWall } from '../components/sidebar_wall';
import { trainersData, sessionsData, categoriesData, silabusPerSessionData } from '../public/data';
import { getTrainerByname } from '../services/id-service';
import { getWall, IPostforSubmit, postPost } from '../services/wall-service';
import AddPostModal from '../components/AddPostModel';

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
    const [selectedDapit, setSelectedDapit] = useState(null);
    const [showDapitModal, setShowDapitModal] = useState(false);

    useEffect(() => {
        console.log('trainerName: ', trainerName);
        fetchWallData();
    }, [trainerName]);

    const fetchWallData = async () => {
        // Fetch wall data here
        try {
            const TrainerData = await getTrainerByname(trainerName);
            console.log('TrainerData:', TrainerData);
            setTrainerId(TrainerData[0]._id);

            const wallData = await getWall(TrainerData[0]._id);
            console.log('wallData:', wallData);
            setWallData(wallData);
        } catch (error) {
            console.error('Error fetching TrainerData:', error);
        }
    };

    const handleAddPost = async (title: string, text: string, instractorName: string) => {
        console.log("handleAppPost")
        try {
            console.log("TrainerId: ", TrainerId)
            console.log("text: ", text)
            console.log("title: ", title)
            console.log("instractorName:", instractorName)
            const submitPost: IPostforSubmit = {
                idTrainer: TrainerId,
                idInstractor: TrainerId,
                nameInstractor: instractorName,
                title: title,
                content: text,
                date: new Date()
            }
            console.log("submitPost: ", submitPost)
            await postPost(submitPost);
            fetchWallData();
        } catch (error) {
            console.error('Error fetching TrainerData:', error);
        }
    }

    const handleLike = async (postId: string) => {
        // Handle like here
    };

    const handleComment = async (postId: string, comment: string) => {
        // Handle comment here
    };

    const handleOpenDapitModal = (dapit) => {
        setSelectedDapit(dapit);
        setShowDapitModal(true);
    };

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
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col md={2}>
                                        <img src="path/to/your/image.png" alt="Event" className="img-fluid" />
                                    </Col>
                                    <Col md={8}>
                                        <Card.Title>{item.type === 'post' ? item.title : `Session: ${item.session}`}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">
                                            {item.type === 'post' ? `Instructor: ${item.instructorName}` : `Syllabus: ${item.syllabus}`}
                                        </Card.Subtitle>
                                        <Card.Text>
                                            {item.type === 'post' ? item.mainText : `Final Grade: ${item.finalGrade}`}
                                        </Card.Text>
                                        {item.type === 'dapit' && <Button variant="link" onClick={() => handleOpenDapitModal(item)}>View Dapit</Button>}
                                    </Col>
                                    <Col md={2} className="text-center">
                                        <Button variant="outline-primary" onClick={() => handleLike(item.id)}>Like</Button>
                                        <Button variant="outline-secondary" onClick={() => handleComment(item.id, 'This is a comment')}>Comment</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <AddPostModal
                show={showAddPostModal}
                handleClose={() => setShowAddPostModal(false)}
                handleSave={handleAddPost}
            />

            <Modal show={showDapitModal} onHide={handleCloseDapitModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Dapit Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedDapit && (
                        <ViewDapit selectedDapit={selectedDapit} onClose={handleCloseDapitModal} />
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Wall;
