import React, { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import ViewDapit from '../components/view_Dapit'; // Assuming you have a ViewDapit component
import { SideBarWall } from '../components/sidebar_wall';
import { postDapit, IDapitforSubmit } from '../services/dapit-serivce';

// import { trainersData, sessionsData, categoriesData, silabusPerSessionData } from '../public/data';
import { getTrainerByname } from '../services/id-service';
import { getWall, IPostforSubmit, postPost, getLikes, putLike, postLike } from '../services/wall-service';
import AddPostModal from '../components/AddPostModel';
import PostCard from '../components/PostCard';
import DapitCard from '../components/DapitCard';
import { set } from 'react-hook-form';
import AddDapit from '../components/AddDapit';
import { FaFilePdf, FaComments  } from "react-icons/fa6";
import { downloadPdf } from '../services/pdf-service';
import { getStartOfToday } from 'react-datepicker/dist/date_utils';
import { ITrainer , IGroup} from '../public/interfaces';
import { useDataContext } from '../DataContext';

interface IWallProps {
    trainer: ITrainer;
}

const Wall: React.FC<IWallProps> = (props) => {
    const contentRef = useRef<HTMLDivElement | null>(null);
    const location = useLocation();
    const state = location.state as IWallProps || {};
    const trainer:ITrainer = state.trainer || props.trainer;
    // const trainerName = state.trainerName || props.trainerName;
    const [showAddDapit, setShowAddDapit] = useState(false);
    const { groups, instructors, trainers, sessions , personalInstractors} =  useDataContext();
    const InstractorsComp = instructors || [];
    const trainersComp = trainers || [];
    const sessionsComp = sessions || [];
    const groupsComp = groups || [];
    const personalInstractorsComp = personalInstractors || [];
    // const [TrainerId, setTrainerId] = useState<string | undefined>();
    const [wallData, setWallData] = useState<any[]>([]);
    const [showAddPostModal, setShowAddPostModal] = useState(false);
    const [selectedDapit, setSelectedDapit] = useState<any | null>(null);
    const [theGroup, setTheGroup] = useState<IGroup>({idsInstractors: [], idsTrainers: [], _id: undefined, name: ""});
    const [showDapitModal, setShowDapitModal] = useState(false);
    const [likesData, setLikesData] = useState<any[]>([]);
    const [openComments, setOpenComments] = useState<string[]>([]);
    const [flagShowComments, setFlagShowComments] = useState<boolean>(false);
    const [flagShowAllComments, setFlagShowAllComments] = useState<boolean>(false);
    useEffect(() => {
        setWallData([]);
        if (trainer._id === undefined) {
            return;
        }
        const group:IGroup | undefined = groupsComp.find((group) => group.idsTrainers?.includes(trainer._id!));
        if (group === undefined) {
            return;
        }
        setTheGroup(group)
        // setTrainerId(undefined);
        fetchWallData();
    }, [trainer, flagShowAllComments]);

    const fetchWallData = async () => {
        try {
            // const TrainerData = await getTrainerByname(trainerName);
            // setTrainerId(TrainerData[0]._id);
            if (trainer._id === undefined) {
                return;
            }
            const wallData = await getWall(trainer._id);
            ////console.log('wallData: ', wallData);
            setWallData(wallData);

            // const likes = await getLikes(TrainerData[0]._id);
            // ////console.log('likes: ', likes);
            // setLikesData(likes);
        } catch (error) {
            ////console.error('Error fetching TrainerData:', error);
        }
    };

    const handleAddPost = async (title: string, text: string, instractorName: string) => {
        try {
            const idInstractor = InstractorsComp.find((instractor) => instractor.name === instractorName)?._id || '0';
            if (trainer._id === undefined) {
                return;
            }
            const submitPost: IPostforSubmit = {
                idTrainer: trainer._id,
                idInstractor: idInstractor,
                nameInstractor: instractorName,
                title: title,
                content: text,
                date: new Date(),
            };
            await postPost(submitPost);
            fetchWallData();
        } catch (error) {
            ////console.error('Error adding post:', error);
        }
    };
    const handleCloseAddDapit =() =>
    {
        setShowAddDapit(false);
    }
   
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
    const handleSubmitInWall = async (submitDapit: IDapitforSubmit) =>{
        console.log("the submit dapit is",submitDapit);
        await postDapit(submitDapit);
        handleCloseAddDapit();
      };
    
    return (
        <Container ref={contentRef} >
            <Row className="p-1" >
                        <h3>{trainer.name} Wall</h3>
            </Row>
            <Row className="mb-2">
                <Col md={4} >
                    <Button className=' m-1' onClick={() => setShowAddPostModal(true)}>Add Post</Button>
                    <Button className=' m-1' onClick={()=> setShowAddDapit(true)}>Add Dapit</Button>
                        {showAddDapit && (
                            <AddDapit 
                                onclose={handleCloseAddDapit}
                                theTrainer={trainer.name}
                                theGroup= {theGroup.name}
                                theDapit={undefined}
                                handleSubmit={handleSubmitInWall}
                                 /> 
                        )}        
                    {/* Todo: choose the group!! */}
                    <Button className=' m-1 ' >
                        <FaFilePdf
                            onClick={toPDF}
                        /> 
                    </Button>
                </Col>
            </Row>
            <Row>
                {wallData.length!=0 ? wallData.map((item, index) => (
                    <Col key={index} md={12} className="mb-3">
                        <div >
                            {item.title !== undefined || item.content !== undefined ? (
                                <PostCard   post={item} idTrainer={trainer._id}  />
                            ) : <DapitCard selectedDapit={item} idTrainer={trainer._id}  />}
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
        </Container>
    );
};

export default Wall;
