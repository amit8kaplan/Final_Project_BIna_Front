import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import ViewDapit from '../components/view_Dapit'; // Assuming you have a ViewDapit component
import { postDapit, IDapitforSubmit } from '../services/dapit-serivce';
import { getWall, IPostforSubmit, postPost } from '../services/wall-service';
import AddPostModal from '../components/AddPostModel';
import PostCard from '../components/PostCard';
import DapitCard from '../components/DapitCard';
import AddDapit from '../components/AddDapit';
import { FaFilePdf } from "react-icons/fa6";
import { downloadPdf } from '../services/pdf-service';
import { ITrainer, IGroup, IInstractor } from '../public/interfaces';
import { useDataContext } from '../DataContext';
import { setgroups } from 'process';

interface IWallProps {
    trainer: ITrainer;
}

const Wall: React.FC<IWallProps> = (props) => {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const location = useLocation();
    const navigate = useNavigate(); // Initialize useNavigate

    const state = location.state as IWallProps || {};
    const trainer: ITrainer = state.trainer || props.trainer;
    const [showAddDapit, setShowAddDapit] = useState(false);
    const { groups, instructors, personalInstractors } = useDataContext();
    const PersonalINstractorsComp = personalInstractors || [];
    const InstractorsComp = instructors || [];
    const groupsComp = groups || [];
    const [wallData, setWallData] = useState<any[]>([]);
    const [showAddPostModal, setShowAddPostModal] = useState(false);
    const [selectedDapit, setSelectedDapit] = useState<any | null>(null);
    const [theGroup, setTheGroup] = useState<IGroup>({ idsInstractors: [], idsTrainers: [], _id: undefined, name: "" });
    const [showDapitModal, setShowDapitModal] = useState(false);
    const [flagShowAllComments, setFlagShowAllComments] = useState<boolean>(false);
    const [thepersonalInstractor, setThePersonalInstractor] = useState<IInstractor | undefined>(undefined);
    const [sessionTrainerId, setSessionTrainerId] = useState<string>('')
    useEffect(() => {
        setWallData([]);
        if (trainer._id === undefined) {
            navigate('/'); // Navigate to home if trainer._id is undefined
            return;
        }

        const idPersonalInstractor: string | undefined = PersonalINstractorsComp.find((pi) => pi.idTrainer === trainer._id)?.idInstractor;
        if (idPersonalInstractor) {
            setThePersonalInstractor(InstractorsComp.find((ins) => ins._id === idPersonalInstractor));
        }
        fetchWallData();

        const group: IGroup | undefined = groupsComp.find((group) => group.idsTrainers?.includes(trainer._id!));
        if (group !== undefined) {
            setTheGroup(group);
        }

    }, [trainer, flagShowAllComments]);

    const fetchWallData = async () => {
        try {
            if (trainer._id === undefined) {
                return;
            }
            const wallData = await getWall(trainer._id);
            setWallData(wallData);
        } catch (error) {
            console.error('Error fetching TrainerData:', error);
        }
    };

    const handleAddPost = async (title: string, text: string,instractorID: string, instractorName: string, file:File| null) => {
        try {
            if (trainer._id === undefined) {
                return;
            }
            const submitPost: IPostforSubmit = {
                idTrainer: trainer._id,
                idInstractor: instractorID,
                nameInstractor: instractorName,
                title: title,
                content: text,
                date: new Date(),
                file: file? file : null
            };
            await postPost(submitPost);
            fetchWallData();
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    const handleCloseAddDapit = () => {
        setShowAddDapit(false);
    };

    const handleCloseDapitModal = () => {
        setSelectedDapit(null);
        setShowDapitModal(false);
    };

    const toPDF = () => {
        console.log('toPDF');
        const content = contentRef.current;
        const currentDate = new Date();

        const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}.${String(currentDate.getMonth() + 1).padStart(2, '0')}.${currentDate.getFullYear()}`;
        const fileName = `${trainer.name}_Wall_${formattedDate}`;

        downloadPdf(content, fileName);
    };

    const handleSubmitInWall = async (submitDapit: IDapitforSubmit) => {
        console.log("the submit dapit is", submitDapit);
        await postDapit(submitDapit);
        handleCloseAddDapit();
    };

    return (
        <Container ref={contentRef}>
            {trainer.name === "" ? (
                <div className="mt-4">
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">Error</h4>
                        <p>I'm sorry, there was a problem understanding which trainer's wall you want to see.</p>
                        <p>Please choose again.</p>
                        <p>If it still doesn't work, please open a call to the "BIna Team".</p>
                        <hr />
                        <p className="mb-0">Thank you for your understanding.</p>
                    </div>
                </div>
            ) : (
                <>
                    <Row className="p-1">
                        <Col md={6}>
                            <h3>{trainer.name} Wall</h3>
                        </Col>
                        <Col md={6} className="text-end">
                            <h5>{theGroup.name}</h5>
                            <h6>{thepersonalInstractor?.name}</h6>
                        </Col>
                    </Row>
                    <Row className="mb-2">
                        <Col md={4}>
                            <Button className='m-1' onClick={() => setShowAddPostModal(true)}>Add Post</Button>
                            <Button className='m-1' onClick={() => setShowAddDapit(true)}>Add Dapit</Button>
                            {showAddDapit && (
                                <AddDapit
                                    onclose={handleCloseAddDapit}
                                    theTrainer={trainer.name}
                                    theGroup={theGroup.name}
                                    theDapit={undefined}
                                    handleSubmit={handleSubmitInWall}
                                />
                            )}
                            <Button className='m-1'>
                                <FaFilePdf onClick={toPDF} />
                            </Button>
                        </Col>
                    </Row>
                    <Row>
                        {wallData.length !== 0 ? wallData.map((item, index) => (
                            <Col key={index} md={12} className="mb-3">
                                <div>
                                    {item.title !== undefined || item.content !== undefined ? (
                                        <PostCard post={item} idTrainer={trainer._id} />
                                    ) : <DapitCard selectedDapit={item} idTrainer={trainer._id} />}
                                </div>
                            </Col>
                        )) : <div>There is no data to display</div>}
                    </Row>

                    <AddPostModal
                        show={showAddPostModal}
                        handleClose={() => setShowAddPostModal(false)}
                        handleSave={handleAddPost}
                    />
                    {selectedDapit && (
                        <ViewDapit selectedDapit={selectedDapit} onClose={handleCloseDapitModal} />
                    )}
                </>
            )}
        </Container>
    );
};

export default Wall;