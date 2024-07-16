import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
import { postDapit, IDapitforSubmit } from '../services/Dapit-serivce';
import {getIdpersonalInstractor} from '../services/id-service';
interface IDapitData {
    nameInstructor: string;
    nameTrainer: string;
    namePersonalInstructor: string;
    group: string;
    session: string;
    syllabus: string;
    tags?: string[];
    identification: Array<{ value: number | undefined | undefined, description: string }>;
    payload: Array<{ value: number | undefined, description: string }>;
    decryption: Array<{ value: number | undefined, description: string }>;
    workingMethod: Array<{ value: number | undefined, description: string }>;
    understandingTheAir: Array<{ value: number | undefined, description: string }>;
    flight: Array<{ value: number | undefined, description: string }>;
    theoretical: Array<{ value: number | undefined, description: string }>;
    thinkingInAir: Array<{ value: number | undefined, description: string }>;
    safety: Array<{ value: number | undefined, description: string }>;
    briefing: Array<{ value: number | undefined, description: string }>;
    debriefing: Array<{ value: number | undefined, description: string }>;
    debriefingInAir: Array<{ value: number | undefined, description: string }>;
    implementationExecise: Array<{ value: number | undefined, description: string }>;
    dealingWithFailures: Array<{ value: number | undefined, description: string }>;
    dealingWithStress: Array<{ value: number | undefined, description: string }>;
    makingDecisions: Array<{ value: number | undefined, description: string }>;
    pilotNature: Array<{ value: number | undefined, description: string }>;
    crewMember: Array<{ value: number | undefined, description: string }>;
    advantage: string[];
    disavantage: string[];
    changeTobeCommender: number | undefined;
    finalGrade: number |  undefined;
    summerize: string;
}

interface IAddDapitProps {
  instructors: string[];
  trainers: string[];
  sessions: string[];
}

const AddDapit: React.FC = () => {
    const location = useLocation();
    console.log(location.state)
    const instructors = location.state.instructors;
    const trainers = location.state.trainers;
    const sessions = location.state.sessions;
    console.log("Instructors: ", instructors)
    console.log("Trainers: ", trainers)
    console.log("Sessions: ", sessions)


  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dapitData, setDapitData] = useState<IDapitData>({
    nameInstructor: '',
    nameTrainer: '',
    namePersonalInstructor: '', // Will be automatically set later
    group: '',
    session: '',
    syllabus: '',
    tags: [''],
    identification: [{ value:  undefined, description: '' }],
    payload: [{ value:  undefined, description: '' }],
    decryption: [{ value:  undefined, description: '' }],
    workingMethod: [{ value:  undefined, description: '' }],
    understandingTheAir: [{ value:  undefined, description: '' }],
    flight: [{ value:  undefined, description: '' }],
    theoretical: [{ value:  undefined, description: '' }],
    thinkingInAir: [{ value:  undefined, description: '' }],
    safety: [{ value:  undefined, description: '' }],
    briefing: [{ value:  undefined, description: '' }],
    debriefing: [{ value:  undefined, description: '' }],
    debriefingInAir: [{ value:  undefined, description: '' }],
    implementationExecise: [{ value:  undefined, description: '' }],
    dealingWithFailures: [{ value:  undefined, description: '' }],
    dealingWithStress: [{ value:  undefined, description: '' }],
    makingDecisions: [{ value:  undefined, description: '' }],
    pilotNature: [{ value:  undefined, description: '' }],
    crewMember: [{ value:  undefined, description: '' }],
    advantage: [],
    disavantage: [],
    summerize: '',
    finalGrade: undefined,
    changeTobeCommender: undefined,
  });
  useEffect(() => {
    const updatePersonalInstructor = async () => {
        if (dapitData.nameInstructor && dapitData.nameTrainer) {
            const { trainerID, personalInstructorID, instructorID, personalName } = await getIdpersonalInstractor(dapitData.nameTrainer, dapitData.nameInstructor);
            console.log("the ids are:", trainerID, personalInstructorID, instructorID, personalName);
            setDapitData((prevData) => ({ ...prevData, namePersonalInstructor: personalName }));
        }
    };
    updatePersonalInstructor();
}, [dapitData.nameInstructor, dapitData.nameTrainer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: string) => {
    setDapitData({ ...dapitData, [field]: e.target.value });
  };
  const handleNamesChange = async(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setDapitData({ ...dapitData, [field]: e.target.value });
    console.log("the name is:",dapitData.nameInstructor, dapitData.nameTrainer)
    if (dapitData.nameInstructor !== '' && dapitData.nameTrainer !== '') {
        const {trainerID, personalInstructorID, instructorID, personalName } = await getIdpersonalInstractor(dapitData.nameTrainer, dapitData.nameInstructor); 
        console.log("the ids are:",trainerID, personalInstructorID, instructorID, personalName)
        setDapitData({ ...dapitData, namePersonalInstructor: personalName });
    }
};
  const handleNestedChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, category: keyof IDapitData) => {
    const updatedCategory = (dapitData[category] as { [key: string]: string }[]).map((item, i) =>
      i === index ? { ...item, [field]: e.target.value } : item
    );
    setDapitData({ ...dapitData, [category]: updatedCategory });
  };
  
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  const onClose = () => {
    // onClose();
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, category: string) => {
    setDapitData({ ...dapitData, [category]: e.target.value.split(',').map((item: string) => item.trim()) });
  };

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting dapit details');
    try{
        const {trainerID, personalInstructorID, instructorID , personalInsName} = await getIdpersonalInstractor(dapitData.nameTrainer, dapitData.nameInstructor); 
        console.log("the ids are:",trainerID, personalInstructorID, instructorID)
        const submitDapit: IDapitforSubmit = {
            nameInstractor: dapitData.nameInstructor,
            namePersonalInstractor: personalInsName,
            nameTrainer: dapitData.nameTrainer,
            idPersonalInstractor: personalInstructorID,
            idInstractor: instructorID,
            idTrainer: trainerID,
            group: dapitData.group,
            session: dapitData.session,
            silabus: parseInt(dapitData.syllabus),
            date: selectedDate as Date,
            identification: dapitData.identification,
            payload: dapitData.payload,
            decryption: dapitData.decryption,
            workingMethod: dapitData.workingMethod,
            understandingTheAir: dapitData.understandingTheAir,
            flight: dapitData.flight,
            theoretical: dapitData.theoretical,
            thinkingInAir: dapitData.thinkingInAir,
            safety: dapitData.safety,
            briefing: dapitData.briefing,
            debriefing: dapitData.debriefing,
            debriefingInAir: dapitData.debriefingInAir,
            implementationExecise: dapitData.implementationExecise,
            dealingWithFailures: dapitData.dealingWithFailures,
            dealingWithStress: dapitData.dealingWithStress,
            makingDecisions: dapitData.makingDecisions,
            pilotNature: dapitData.pilotNature,
            crewMember: dapitData.crewMember,
            advantage: dapitData.advantage,
            disavantage: dapitData.disavantage,
            changeTobeCommender: dapitData.changeTobeCommender,
            finalGrade: dapitData.finalGrade,
            summerize: dapitData.summerize
        
        };
        console.log("the submit dapit is",submitDapit);
        await postDapit(submitDapit);
        // Reset the form to its initial state here
        setDapitData({
            nameInstructor: '',
            nameTrainer: '',
            namePersonalInstructor: '',
            group: '',
            session: '',
            syllabus: '',
            tags: '',
            identification: [{ value:  undefined, description: '' }],
            payload: [{ value:  undefined, description: '' }],
            decryption: [{ value:  undefined, description: '' }],
            workingMethod: [{ value:  undefined, description: '' }],
            understandingTheAir: [{ value:  undefined, description: '' }],
            flight: [{ value:  undefined, description: '' }],
            theoretical: [{ value:  undefined, description: '' }],
            thinkingInAir: [{ value:  undefined, description: '' }],
            safety: [{ value:  undefined, description: '' }],
            briefing: [{ value:  undefined, description: '' }],
            debriefing: [{ value:  undefined, description: '' }],
            debriefingInAir: [{ value:  undefined, description: '' }],
            implementationExecise: [{ value:  undefined, description: '' }],
            dealingWithFailures: [{ value:  undefined, description: '' }],
            dealingWithStress: [{ value:  undefined, description: '' }],
            makingDecisions: [{ value:  undefined, description: '' }],
            pilotNature: [{ value:  undefined, description: '' }],
            crewMember: [{ value:  undefined, description: '' }],
            advantage: [],
            disavantage: [],
            summerize: '',
            finalGrade:  undefined,
            changeToBeCommender:  undefined,
        });
        onClose(); // Close the modal after submission
    }catch(error){
        console.error('Error submitting dapit:', error);    
    }
};

  const handleSendDraft = () => {
    console.log('Sending draft of dapit details');
  };

  const renderDetailedRatings = () => {
    const ratingCategories = [
      { title: 'Identification', data: dapitData.identification, category: 'identification' },
      { title: 'Payload', data: dapitData.payload, category: 'payload' },
      { title: 'Decryption', data: dapitData.decryption, category: 'decryption' },
      { title: 'Working Method', data: dapitData.workingMethod, category: 'workingMethod' },
      { title: 'Understanding The Air', data: dapitData.understandingTheAir, category: 'understandingTheAir' },
      { title: 'Flight', data: dapitData.flight, category: 'flight' },
      { title: 'Theoretical', data: dapitData.theoretical, category: 'theoretical' },
      { title: 'Thinking In Air', data: dapitData.thinkingInAir, category: 'thinkingInAir' },
      { title: 'Safety', data: dapitData.safety, category: 'safety' },
      { title: 'Briefing', data: dapitData.briefing, category: 'briefing' },
      { title: 'Debriefing', data: dapitData.debriefing, category: 'debriefing' },
      { title: 'Debriefing In Air', data: dapitData.debriefingInAir, category: 'debriefingInAir' },
      { title: 'Implementation Exercise', data: dapitData.implementationExecise, category: 'implementationExecise' },
      { title: 'Dealing With Failures', data: dapitData.dealingWithFailures, category: 'dealingWithFailures' },
      { title: 'Dealing With Stress', data: dapitData.dealingWithStress, category: 'dealingWithStress' },
      { title: 'Making Decisions', data: dapitData.makingDecisions, category: 'makingDecisions' },
      { title: 'Pilot Nature', data: dapitData.pilotNature, category: 'pilotNature' },
      { title: 'Crew Member', data: dapitData.crewMember, category: 'crewMember' },
    ];

    return ratingCategories.map((item, index) => {
      if (index % 2 === 0) {
        return (
          <Row className="mb-3" key={index}>
            <Col md={6}>
              <h5>{item.title}</h5>
              {item.data.map((data, idx) => (
                <div key={idx} className="mb-2">
                  <Form.Control
                    type="number"
                    min="4"
                    max="10"
                    placeholder="Value"
                    value={data.value}
                    onChange={(e) => handleNestedChange(idx, e, 'value', item.category)}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Description"
                    value={data.description}
                    onChange={(e) => handleNestedChange(idx, e, 'description', item.category)}
                    className="mt-1"
                  />
                </div>
              ))}
            </Col>
            {index + 1 < ratingCategories.length && (
              <Col md={6}>
                <h5>{ratingCategories[index + 1].title}</h5>
                {ratingCategories[index + 1].data.map((data, idx) => (
                  <div key={idx} className="mb-2">
                    <Form.Control
                      type="number"
                      min="4"
                      max="10"
                      placeholder="Value"
                      value={data.value}
                      onChange={(e) => handleNestedChange(idx, e, 'value', ratingCategories[index + 1].category)}
                    />
                    <Form.Control
                      type="text"
                      placeholder="Description"
                      value={data.description}
                      onChange={(e) => handleNestedChange(idx, e, 'description', ratingCategories[index + 1].category)}
                      className="mt-1"
                    />
                  </div>
                ))}
              </Col>
            )}
          </Row>
        );
      } else {
        return null;
      }
    });
  };

  return (
    <Modal show={true} onHide={onClose} size="xl" style={{ fontSize: '0.9em', overflowY: 'auto' }}>
      <Modal.Header closeButton>
        <Button variant="primary" className="float-start" onClick={handleSendDraft}>
          Send me draft
        </Button>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <Row className="mb-3">
            <Col md={3}>
              <h4>Instructor</h4>
              <Form.Control as="select" value={dapitData.nameInstructor} onChange={(e) => handleChange(e, 'nameInstructor')}>
              <option value="">Select Instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor} value={instructor}>
                    {instructor}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={3}>
              <h4>Personal Instructor</h4>
              <Form.Control type="text" value={dapitData.namePersonalInstructor} onChange={(e) => handleChange(e, 'namePersonalInstructor')} />
              </Col>
            <Col md={3}>
              <h4>Trainer</h4>
              <Form.Control as="select" value={dapitData.nameTrainer} onChange={(e) => handleChange(e, 'nameTrainer')}>
              <option value="">Select Trainer</option>
                {trainers.map((trainer) => (
                  <option key={trainer} value={trainer}>
                    {trainer}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={3}>
              <h4>Date</h4>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={3}>
              <h4>Group</h4>
              <Form.Control type="text" value={dapitData.group} onChange={(e) => handleChange(e, 'group')} />
            </Col>
            <Col md={3}>
              <h4>Session</h4>
              <Form.Control as="select" value={dapitData.session} onChange={(e) => handleChange(e, 'session')}>
                <option value="">Select Session</option>
                {sessions.map((session, idx) => (
                  <option key={idx} value={session}>
                    {session}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={3}>
              <h4>Syllabus</h4>
              <Form.Control
                type="number"
                min="1"
                max="10"
                required
                value={dapitData.syllabus}
                onChange={(e) => handleChange(e, 'syllabus')}
              />
            </Col>
            <Col md={3}>
              <h4>Tags</h4>
              <Form.Control
                type="text"
                value={dapitData.tags}
                onChange={(e) => handleArrayChange(e, 'tags', 'tags')}
                placeholder="Comma separated tags"
              />
            </Col>
          </Row>

          <h4 className="my-3">Detailed Ratings</h4>
          {renderDetailedRatings()}

          <Row className="mb-3">
  <Col md={6}>
    <h4>Advantages</h4>
    {dapitData.advantage.map((adv, idx) => (
      <div key={idx} className="mb-2">
        <Form.Control
          type="text"
          value={adv.value1}
          onChange={(e) => handleNestedChange(idx, e, 'value1', 'advantage')}
          className="mb-1"
        />
        <Form.Control
          type="text"
          value={adv.value2}
          onChange={(e) => handleNestedChange(idx, e, 'value2', 'advantage')}
          className="mb-1"
        />
        <Form.Control
          type="text"
          value={adv.value3}
          onChange={(e) => handleNestedChange(idx, e, 'value3', 'advantage')}
        />
      </div>
    ))}
  </Col>
  <Col md={6}>
    <h4>Disadvantages</h4>
    {dapitData.disavantage.map((dis, idx) => (
      <div key={idx} className="mb-2">
        <Form.Control
          type="text"
          value={dis.value1}
          onChange={(e) => handleNestedChange(idx, e, 'value1', 'disavantage')}
          className="mb-1"
        />
        <Form.Control
          type="text"
          value={dis.value2}
          onChange={(e) => handleNestedChange(idx, e, 'value2', 'disavantage')}
          className="mb-1"
        />
        <Form.Control
          type="text"
          value={dis.value3}
          onChange={(e) => handleNestedChange(idx, e, 'value3', 'disavantage')}
        />
      </div>
    ))}
  </Col>
</Row>


          <Row className="mb-3">
            <Col>
              <h4>Summary</h4>
              <Form.Control
                as="textarea"
                rows={3}
                value={dapitData.summerize}
                onChange={(e) => handleChange(e, 'summerize')}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={6}>
              <h4>Final Grade</h4>
              <Form.Control
                type="number"
                min="4"
                max="10"
                required
                value={dapitData.finalGrade}
                onChange={(e) => handleChange(e, 'finalGrade')}
              />
            </Col>
            <Col md={6}>
              <h4>Change to be Commander</h4>
              <Form.Control
                type="number"
                min="4"
                max="10"
                required
                value={dapitData.changeToBeCommender}
                onChange={(e) => handleChange(e, 'changeToBeCommender')}
              />
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddDapit;
