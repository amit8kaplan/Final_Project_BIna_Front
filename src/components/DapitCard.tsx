import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { set } from 'react-hook-form';
 import ViewDapit  from '../components/view_Dapit'; // Assuming you have a ViewDapit component
import {dateOnly} from '../services/dapit-serivce';


interface IData {
    value: number;
    description: string;
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
  }

const DapitCard: React.FC<IDapitProps> = ({ selectedDapit }) => {
    const [newDate, setNewDate] = useState<string | null>(null);
    useEffect(()=>{
        console.log('Dapit: ', selectedDapit);
        if (selectedDapit.date !==null && selectedDapit.date !== undefined) {
            setNewDate(dateOnly(selectedDapit.date));
        }
    }, [selectedDapit]);
    const [viewDapit, setViewDapit] = useState<any | null>(null);
    const [showViewDapitModal, setShowViewDapitModal] = useState(false);
    const handleOpenViewDapitModal = (Dapit: any) => {
        console.log("Dapit: ", Dapit);
        setViewDapit(Dapit);
        setShowViewDapitModal(true);
    }
    const handleCloseViewDapitModal = () => {
        setViewDapit(null);
        setShowViewDapitModal(false);
    };

    const handleLike = async (DapitId: string) => {
        // Handle like here
    };

    const handleComment = async (DapitId: string, comment: string) => {
        // Handle comment here
    };
    return (
        <div><Card onClick={()=> handleOpenViewDapitModal(selectedDapit)}>
            <Card.Body>
                <Row>
                    <Col md={2}>
                        <Card.Subtitle className="mb-2 text-muted">{selectedDapit.namePersonalInstractor}</Card.Subtitle>
                        <Card.Subtitle className="mb-2 text-muted">{newDate }</Card.Subtitle>
                    </Col>
                    <Col md={2}>
                        <Card.Title>{selectedDapit.session}</Card.Title>
                        <Card.Text>silabus: {selectedDapit.silabus}</Card.Text>
                    </Col>
                    <Col md={2}>
                        <Card.Text>finalGrade: {selectedDapit.finalGrade}</Card.Text>
                        <Card.Text>chance: {selectedDapit.changeTobeCommender}</Card.Text>
                    </Col>
                    <Col md={4}>
                        <Card.Text>{selectedDapit.summerize}</Card.Text>
                    </Col>
                    <Col md={2}>
                        <Button variant="outline-primary" onClick={() => handleLike(selectedDapit._id)}>Like</Button>
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
