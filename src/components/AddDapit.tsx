import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useLocation } from 'react-router-dom';
import { postDapit, IDapitforSubmit } from '../services/dapit-serivce';
import {getIdpersonalInstractor} from '../services/id-service';
import '../css/add_dapit.css';
import { downloadPdf } from '../services/pdf-service';

export interface IDapitData {
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
  instructors?: string[];
  trainers?: string[];
  sessions?: string[];
  groups?: string[];
  onclose: () => void;
  theTrainer: string;
  theGroup: string;
}

const AddDapit: React.FC<IAddDapitProps> = (props) => {
    const navigate = useNavigate();
    // const route = useRoute();
    const location = useLocation();
    const state = location.state as IAddDapitProps || {};
    const contentRef = useRef<HTMLDivElement | null>(null);
    const theTrainer = state.theTrainer || props.theTrainer || '';
    const theGroup = state.theGroup || props.theGroup || '';
    const instructors = state.instructors || props.instructors || [];
    const trainers = state.trainers || props.trainers || [];
    const sessions = state.sessions || props.sessions || [];
    const groups = state.groups || props.groups || [];
    console.log("Instructors: ", instructors)
    console.log("Trainers: ", trainers)
    console.log("Sessions: ", sessions)
    console.log("groups: ", groups)


  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dapitData, setDapitData] = useState<IDapitData>({
    nameInstructor: '',
    nameTrainer: theTrainer,
    namePersonalInstructor: '', // Will be automatically set later
    group: theGroup,
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
    advantage: ['','',''],
    disavantage: ['','', '' ],
    
    summerize: '',
    finalGrade: undefined,
    changeTobeCommender: undefined,
  });
  useEffect(() => {
    console.log("AddDapit useEffect");
    const updatePersonalInstructor = async () => {
        if (dapitData.nameInstructor && dapitData.nameTrainer) {
            const { trainerID, PersonalInstractorID, InstractorID, personalName } = await getIdpersonalInstractor(dapitData.nameTrainer, dapitData.nameInstructor);
            console.log("the ids are:", trainerID, PersonalInstractorID, InstractorID, personalName);
            setDapitData((prevData) => ({ ...prevData, namePersonalInstructor: personalName }));
        }
    };
    updatePersonalInstructor();
}, [dapitData.nameInstructor, dapitData.nameTrainer]);
const toPDF = () => {
  const content = contentRef.current;
  const fileName = "Draft_dapit_of"+dapitData.nameTrainer+"_"+dapitData.session+"_"+dapitData.syllabus+"_"+dapitData.nameInstructor;
  downloadPdf(content, fileName);
};
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: string) => {
    setDapitData({ ...dapitData, [field]: e.target.value });
  };
  const handleNamesChange = async(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setDapitData({ ...dapitData, [field]: e.target.value });
    console.log("the name is:",dapitData.nameInstructor, dapitData.nameTrainer)
    if (dapitData.nameInstructor !== '' && dapitData.nameTrainer !== '') {
        const {trainerID, PersonalInstractorID, InstractorID, personalName } = await getIdpersonalInstractor(dapitData.nameTrainer, dapitData.nameInstructor); 
        console.log("the ids are:",trainerID, PersonalInstractorID, InstractorID, personalName)
        setDapitData({ ...dapitData, namePersonalInstructor: personalName });
    }
};
  const handleNestedChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, category: keyof IDapitData) => {
    if (dapitData[category]!=undefined){
      if (Array.isArray(dapitData[category])) {
          const updatedCategory = (dapitData[category] as Array<{ value: number | undefined, description: string }>).map((item, i) =>
            i === index ? { ...item, [field]: e.target.value } : item
          );
          setDapitData({ ...dapitData, [category]: updatedCategory });
      }
    }
  };
  
  const handleAdandDis =  (index: number, e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof IDapitData) => {
    const updatedArray = [...dapitData[field]];
    updatedArray[index] = e.target.value;
    setDapitData({ ...dapitData, [field]: updatedArray });
  };
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };
  // const onClose = () => {
  //   navigate("/")
  // };
  const handleOnClose = () => {
    console.log("onclose");
    // navigate("/");
    props.onclose();
  }
  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, category: string) => {
    setDapitData({ ...dapitData, [category]: e.target.value.split(',').map((item: string) => item.trim()) });
  };

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting dapit details');
    try{
        //trainerID: trainerID, PersonalInstractorID: PersonalInstractorID, InstractorID: InstractorID, personalName: personalName
        const {trainerID, PersonalInstractorID, InstractorID , personalName} = await getIdpersonalInstractor(dapitData.nameTrainer, dapitData.nameInstructor); 
        console.log("trainerID:",trainerID)
        console.log("PersonalInstractorID:",PersonalInstractorID)
        console.log("InstractorID:",InstractorID)
        console.log("dapitData.changetobecoma:",dapitData.changeTobeCommender)
        const submitDapit: IDapitforSubmit = {
            nameInstractor: dapitData.nameInstructor,
            namePersonalInstractor: personalName[0],
            nameTrainer: dapitData.nameTrainer,
            idPersonalInstractor: PersonalInstractorID[0],
            idInstractor: InstractorID[0],
            idTrainer: trainerID[0],
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
            tags: [],
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
            changeTobeCommender:  undefined,
        });
        handleOnClose();
    }catch(error){
        console.error('Error submitting dapit:', error);    
    }
};

const getCellDesStyle = (value: number | undefined) => {
  if (!value) {
    return {}; // Return default style when no value is present (e.g., on backspace)
  }
  if (value == 10) return {  border: ' solid forestgreen' };
  else if (value == 9) return {  border: ' solid limegreen' };
  else if (value == 8) return {  border: ' solid lightgreen' };
  else if (value == 7) return {  border: ' solid silver' };
  else if (value == 6) return {  border: ' solid khaki' };
  else if (value == 5) return {  border: ' solid lightpink' };
  else if (value == 4) return {  border: ' solid lightcoral' };

  return {};
};

const getCellStyle = (value: number | undefined) => {
  if (!value) {
    return {}; // Return default style when no value is present (e.g., on backspace)
  }
  // if (value == undefined) return { backgroundColor: 'light-gray', color: 'black' };
  else if (value == 10) return { backgroundColor: 'forestgreen', color: 'black' };
  else if (value == 9) return { backgroundColor: 'limegreen', color: 'black' };
  else if (value == 8) return { backgroundColor: 'lightgreen', color: 'black' };
  else if (value == 7) return { backgroundColor: 'silver', color: 'black'  };
  else if (value ==6) return { backgroundColor: 'khaki' };
  else if (value ==5 ) return { backgroundColor: 'lightpink' };
  else if (value ==4) return { backgroundColor: 'lightcoral' };

  return {};
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
                <div  key={idx} className="mb-2">
                  <Form.Control
                    style={getCellStyle(data.value || undefined)}
                    type="number"
                    min="4"
                    max="10"
                    placeholder="Value"
                    value={data.value}
                    onChange={(e) =>
                      {
                        let value = (Math.max(4, Math.min(10, parseInt(e.target.value, 10))));
                        handleNestedChange(idx, { target: { value } }, 'value', item.category);
                      }}
                  />
                  <Form.Control
                  style={getCellDesStyle(data.value || undefined)}
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
                    style={getCellStyle(data.value || undefined)}
                      type="number"
                      min="4"
                      max="10"
                      placeholder="Value"
                      value={data.value}
                      onChange={(e) =>
                      {
                        let value = (Math.max(4, Math.min(10, parseInt(e.target.value, 10))));
                        handleNestedChange(idx, { target: { value } }, 'value', ratingCategories[index + 1].category);
                      }}
                         />
                    <Form.Control
                      style={getCellDesStyle(data.value || undefined)}
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
    // <Modal show={true} onHide={onClose} size="xl" style={{ fontSize: '0.9em', overflowY: 'auto' }}>

    <Modal show={true} onHide={handleOnClose} size="xl" style={{ fontSize: '0.9em', overflowY: 'auto' }}>
      <Modal.Header style={{fontSize:"20px"}} closeButton>
        <Button variant="secondary" className="float-start" onClick={toPDF}>
            Download PDF
        </Button>
      </Modal.Header>
      <Modal.Body>
        <div className="container" ref={contentRef}>
          <Row className="mb-3">
            <Col md={3}>
              <h4>Instructor</h4>
              <Form.Control as="select" value={dapitData.nameInstructor} onChange={(e) => handleChange(e, 'nameInstructor')}>
              <option value="">Select Instructor</option>
                {instructors.map((instructor, idx) => (
                  <option key={idx} value={instructor}>
                    {instructor}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={3}>
              <h4>Trainer</h4>
              <Form.Control as="select" value={dapitData.nameTrainer } onChange={(e) => handleChange(e, 'nameTrainer')}>
              <option value="">Select Trainer</option>
                {trainers.map((trainer) => (
                  <option key={trainer} value={trainer}>
                    {trainer}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={3}>
              <h4>Personal Instructor</h4>
              <Form.Control type="text" value={dapitData.namePersonalInstructor} onChange={(e) => handleChange(e, 'namePersonalInstructor')} />
              </Col>
            
            <Col md={3}>
              <h4>Date</h4>
              <div style={{fontSize: "21px"}}>
                <DatePicker
                  
                  selected={selectedDate}
                  onChange={handleDateChange}
                  />
                </div>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col md={4}>
              <h4>Group</h4>
              <Form.Control as="select" value={dapitData.group} onChange={(e) => handleChange(e, 'group')}>
                <option value="">Select Group</option>
                {groups.map((group, idx) => (
                        <option key={idx} value={group}>
                        {group}
                        </option>
                ))}
                </Form.Control>
            </Col>
            <Col md={4}>
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
            <Col md={4}>
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
            {/* <Col md={3}>
              <h4>Tags</h4>
              <Form.Control
                type="text"
                value={dapitData.tags}
                onChange={(e) => handleArrayChange(e, 'tags', 'tags')}
                placeholder="Comma separated tags"
              />
            </Col> */}
          </Row>
          <div style={{borderTop: "6px dotted lightgray", borderBottom: "6px dotted lightgray"}}>
          <h4 className="h4style">Detailed Ratings</h4>
          {renderDetailedRatings()}
          </div>
          <Row className="mb-3">
          <Col md={6}>
          <div style={{paddingTop: "10px"}}>
            <h4 style={{color: 'green'}}>Advantages</h4>
        
            {dapitData.advantage.map((adv, idx) => (
              <div key={idx} className="mb-2">
                <Form.Control
                  type="text"
                  value={adv}
                  onChange={(e) => handleAdandDis(idx, e, 'advantage')}
                  className="mb-1"
                />
              </div>
            ))}
            </div>
          </Col>
        <Col md={6}>
        <div style={{paddingTop: "10px" }}>

          <h4 style={{color: 'red'}}>Disadvantages</h4>
          {dapitData.disavantage.map((dis, idx) => (
            <div key={idx} className="mb-2">
              <Form.Control
                type="text"
                value={dis}
                onChange={(e) => handleAdandDis(idx, e, 'disavantage')}
                className="mb-1"
              />
            </div>
          ))}
          </div>
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
              style={getCellStyle(dapitData.finalGrade || undefined)}
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
              style={getCellStyle(dapitData.changeTobeCommender || undefined)}
                type="number"
                min="4"
                max="10"
                required
                value={dapitData.changeTobeCommender}
                onChange={(e) => handleChange(e, 'changeTobeCommender')}
              />
            </Col>
          </Row>
        </div>
      </Modal.Body>
      <Modal.Footer>
      <Button variant="secondary" onClick={handleOnClose}>
        Close
      </Button>
      <Button variant="primary" onClick={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}>
        Save Changes
      </Button>
    </Modal.Footer>
    </Modal>
  );
};

export default AddDapit;