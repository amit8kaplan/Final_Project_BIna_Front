import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import ViewDapit from '../components/view_Dapit'; // Assuming you have a ViewDapit component
import { SideBarWall } from '../components/sidebar_wall';
import { trainersData, sessionsData, categoriesData, silabusPerSessionData } from '../public/data';
import { getTrainerByname } from '../services/id-service';
import { getWall, IPostforSubmit, postPost, getLikes, putLike, postLike } from '../services/wall-service';
import AddPostModal from '../components/AddPostModel';
import PostCard from '../components/PostCard';
import DapitCard from '../components/DapitCard';
import { set } from 'react-hook-form';
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
    const [likesData, setLikesData] = useState<any[]>([]);
    useEffect(() => {
        setWallData([]);
        setTrainerId(undefined);
        fetchWallData();
    }, [trainerName]);

    const fetchWallData = async () => {
        try {
            const TrainerData = await getTrainerByname(trainerName);
            setTrainerId(TrainerData[0]._id);

            const wallData = await getWall(TrainerData[0]._id);
            console.log('wallData: ', wallData);
            setWallData(wallData);

            // const likes = await getLikes(TrainerData[0]._id);
            // console.log('likes: ', likes);
            // setLikesData(likes);
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

    const handleLike = async (id: string) => {
      // console.log("handleLike: ", id);
      // likesData.find((like) => like.idDapitOrPost === id) ? 
      // await putLike(id, 'like', likesData.find((like) => like.idDapitOrPost === id).count + 1)
      //  : await postLike(id);
      //   fetchWallData();
    }

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
                {wallData.length!=0 ? wallData.map((item, index) => (
                    <Col key={index} md={12} className="mb-3">
                        <div >
                            {item.title !== undefined || item.content !== undefined ? (
                                <PostCard   post={item} idTrainer={TrainerId}  />
                            ) : <DapitCard selectedDapit={item} idTrainer={TrainerId} />}
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
