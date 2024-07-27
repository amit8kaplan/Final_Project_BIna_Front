import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, NavBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ViewDapit from '../components/view_Dapit'; // Assuming you have a ViewDapit component
import { SideBarWall } from '../components/sidebar_wall';
import { useLocation } from 'react-router-dom';
import { trainersData, sessionsData, categoriesData, silabusPerSessionData } from '../public/data';
import { getTrainerByname} from '../services/id-service';
import { getWall } from '../services/wall-service';
import { set } from 'react-hook-form';
interface IWallProps{
    trainerName: string;
}
export interface ITrainer{
  name: string;
  _id: string;
}

const Wall: React.FC<IWallProps> = (props) => {

  const location = useLocation();
  const state = location.state as IWallProps || {};
  const trainerName = state.trainerName || props.trainerName;
  const [TrainerId, setTrainerId] = useState<string | undefined>();
  const [wallData, setWallData] = useState([]);
  useEffect(() => {
    console.log('trainerName: ', trainerName);
    fetchWallData();
  }, [trainerName]);

  const fetchWallData = async () => {
    // Fetch wall data here
    try{
      const TrainerData = await getTrainerByname(trainerName);
      console.log('TrainerData:', TrainerData);
      setTrainerId(TrainerData[0]._id);
      
      const wallData  = await getWall(TrainerData[0]._id);
      console.log('wallData:', wallData);
    }
    catch (error) {
      console.error('Error fetching TrainerData:', error);
    }
  
  };
  const [selectedDapit, setSelectedDapit] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = (dapit) => {
    setSelectedDapit(dapit);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedDapit(null);
    setShowModal(false);
  };

  return (
    // <div>
    //     <div>
    //         <SideBarWall img="https://via.placeholder.com/150" name="John Doe" age={30} job="Pilot" personalInstructor="Jane Doe" avgGrade={90} />
    //     </div>
    // <div>
    //   <NavBar />
    //   <Container>
    //     <Row>
    //       <Col>
    //         <h2>{trainerName}'s Wall</h2>
    //         {wallData.map((item, index) => (
    //           <Card key={index} className="mb-3">
    //             <Card.Body>
    //               <Card.Title>{item.title}</Card.Title>
    //               <Card.Text>{item.content}</Card.Text>
    //               <Button variant="primary" onClick={() => handleOpenModal(item)}>View Details</Button>
    //             </Card.Body>
    //           </Card>
    //         ))}
    //         <Button variant="secondary" className="mt-3">Load More</Button>
    //       </Col>
    //     </Row>
    //   </Container>

    //   <Modal show={showModal} onHide={handleCloseModal}>
    //     <Modal.Header closeButton>
    //       <Modal.Title>Dapit Details</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //       {selectedDapit && (
    //         <ViewDapit selectedDapit={selectedDapit} onClose={handleCloseModal} />
    //       )}
    //     </Modal.Body>
    //   </Modal>
    // </div>
    // </div>
    <div>
      {TrainerId}
    </div>
  );
};

export default Wall;
