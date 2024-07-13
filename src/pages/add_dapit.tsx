import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

interface IDapitData {
    nameInstructor: string;
    nameTrainer: string;
    namePersonalInstructor: string;
    group: string;
    session: string;
    syllabus: string;
    tags: string;
    identification: { value: string; description: string; }[];
    payload: { value: string; description: string; }[];
    decryption: { value: string; description: string; }[];
    workingMethod: { value: string; description: string; }[];
    understandingTheAir: { value: string; description: string; }[];
    flight: { value: string; description: string; }[];
    theoretical: { value: string; description: string; }[];
    thinkingInAir: { value: string; description: string; }[];
    safety: { value: string; description: string; }[];
    briefing: { value: string; description: string; }[];
    debriefing: { value: string; description: string; }[];
    debriefingInAir: { value: string; description: string; }[];
    implementationExecise: { value: string; description: string; }[];
    dealingWithFailures: { value: string; description: string; }[];
    dealingWithStress: { value: string; description: string; }[];
    makingDecisions: { value: string; description: string; }[];
    pilotNature: { value: string; description: string; }[];
    crewMember: { value: string; description: string; }[];
    advantage: { value1: string; value2: string; value3: string; }[];
    disavantage: { value1: string; value2: string; value3: string; }[];
    summerize: string;
    finalGrade: string;
    changeToBeCommender: string;
    [key: string]: any; // Index signature to handle dynamic access
  }
  
interface IData {
  value: number;
  description: string;
}

interface IAddDapitProps {
  instructors: string[];
  trainers: string[];
  sessions: string[];
  onClose: () => void;
  onSubmit: (dapitData: any) => void; // Adjust this type based on your actual data
}

const AddDapit: React.FC<IAddDapitProps> = ({ instructors, trainers, sessions, onClose, onSubmit }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [dapitData, setDapitData] = useState({
    nameInstructor: '',
    nameTrainer: '',
    namePersonalInstructor: '', // Will be automatically set later
    group: '',
    session: '',
    syllabus: '',
    tags: '',
    identification: [{ value: '', description: '' }],
    payload: [{ value: '', description: '' }],
    decryption: [{ value: '', description: '' }],
    workingMethod: [{ value: '', description: '' }],
    understandingTheAir: [{ value: '', description: '' }],
    flight: [{ value: '', description: '' }],
    theoretical: [{ value: '', description: '' }],
    thinkingInAir: [{ value: '', description: '' }],
    safety: [{ value: '', description: '' }],
    briefing: [{ value: '', description: '' }],
    debriefing: [{ value: '', description: '' }],
    debriefingInAir: [{ value: '', description: '' }],
    implementationExecise: [{ value: '', description: '' }],
    dealingWithFailures: [{ value: '', description: '' }],
    dealingWithStress: [{ value: '', description: '' }],
    makingDecisions: [{ value: '', description: '' }],
    pilotNature: [{ value: '', description: '' }],
    crewMember: [{ value: '', description: '' }],
    advantage: [{ value1: '', value2: '', value3: '' }],
    disavantage: [{ value1: '', value2: '', value3: '' }],
    summerize: '',
    finalGrade: '',
    changeToBeCommender: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: string) => {
    setDapitData({ ...dapitData, [field]: e.target.value });
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
  

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, category: string) => {
    setDapitData({ ...dapitData, [category]: e.target.value.split(',').map((item: string) => item.trim()) });
  };

  const handleSubmit = () => {
    onSubmit(dapitData);
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
                {instructors.map((instructor, idx) => (
                  <option key={idx} value={instructor}>
                    {instructor}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={3}>
              <h4>Personal Instructor</h4>
              <Form.Control type="text" value={dapitData.namePersonalInstructor} readOnly />
            </Col>
            <Col md={3}>
              <h4>Trainer</h4>
              <Form.Control as="select" value={dapitData.nameTrainer} onChange={(e) => handleChange(e, 'nameTrainer')}>
                <option value="">Select Trainer</option>
                {trainers.map((trainer, idx) => (
                  <option key={idx} value={trainer}>
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
