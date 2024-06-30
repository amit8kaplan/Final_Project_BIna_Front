import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface IData {
  value: number;
  description: string;
}

interface IDapitProps {
  selectedDapit: {
    nameInstructor: string;
    namePersonalInstructor: string;
    nameTrainer: string;
    group: string;
    session?: string;
    syllabus: number;
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
    changeToBeCommender: number;
  };
  onClose: () => void;
}

const ViewDapit: React.FC<IDapitProps> = ({ selectedDapit, onClose }) => {
    const onEmail = () => {
        console.log('Emailing dapit details');
    };

  const renderDetailedRatings = () => {
    const ratingCategories = [
      { title: "Identification", data: selectedDapit.identification },
      { title: "Payload", data: selectedDapit.payload },
      { title: "Decryption", data: selectedDapit.decryption },
      { title: "Working Method", data: selectedDapit.workingMethod },
      { title: "Understanding The Air", data: selectedDapit.understandingTheAir },
      { title: "Flight", data: selectedDapit.flight },
      { title: "Theoretical", data: selectedDapit.theoretical },
      { title: "Thinking In Air", data: selectedDapit.thinkingInAir },
      { title: "Safety", data: selectedDapit.safety },
      { title: "Briefing", data: selectedDapit.briefing },
      { title: "Debriefing", data: selectedDapit.debriefing },
      { title: "Debriefing In Air", data: selectedDapit.debriefingInAir },
      { title: "Implementation Exercise", data: selectedDapit.implementationExecise },
      { title: "Dealing With Failures", data: selectedDapit.dealingWithFailures },
      { title: "Dealing With Stress", data: selectedDapit.dealingWithStress },
      { title: "Making Decisions", data: selectedDapit.makingDecisions },
      { title: "Pilot Nature", data: selectedDapit.pilotNature },
      { title: "Crew Member", data: selectedDapit.crewMember },
    ];

    return ratingCategories.map((item, index) => {
      if (index % 2 === 0) {
        return (
          <div className="row mb-3" key={index}>
            <div className="col-md-6">
              <h5>{item.title}</h5>
              <ul className="list-group">
                {item.data.map((data, idx) => (
                  <li key={idx} className="list-group-item">
                    <strong>{data.value}</strong>: {data.description}
                  </li>
                ))}
              </ul>
            </div>
            {index + 1 < ratingCategories.length && (
              <div className="col-md-6">
                <h5>{ratingCategories[index + 1].title}</h5>
                <ul className="list-group">
                  {ratingCategories[index + 1].data.map((data, idx) => (
                    <li key={idx} className="list-group-item">
                      <strong>{data.value}</strong>: {data.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      } else {
        return null;
      }
    });
  };

  return (
    <Modal show={true} onHide={onClose} size="xl" style={{ fontSize: '0.9em', overflowY: 'auto' }}>
      <Modal.Header closeButton>
        <div className="container">
            <Button variant="primary" className="float-start" onClick={onEmail}>
                Email It
            </Button>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="container">
          <div className="row mb-3">
            <div className="col-md-3">
              <h4>Instructor</h4>
              <p>{selectedDapit.nameInstructor}</p>
            </div>
            <div className="col-md-3">
              <h4>Personal Instructor</h4>
              <p>{selectedDapit.namePersonalInstructor}</p>
            </div>
            <div className="col-md-3">
              <h4>Trainer</h4>
              <p>{selectedDapit.nameTrainer}</p>
            </div>
            <div className="col-md-3">
              <h4>Date</h4>
              <p>{selectedDapit.date}</p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3">
              <h4>Group</h4>
              <p>{selectedDapit.group}</p>
            </div>
            <div className="col-md-3">
              <h4>Session</h4>
              <p>{selectedDapit.session}</p>
            </div>
            <div className="col-md-3">
              <h4>Syllabus</h4>
              <p>{selectedDapit.syllabus}</p>
            </div>
            <div className="col-md-3">
              <h4>Tags</h4>
              <p>{selectedDapit.tags.join(', ')}</p>
            </div>
          </div>

          <h4 className="my-3">Detailed Ratings</h4>
          {renderDetailedRatings()}

          <div className="row mb-3">
            <div className="col-md-6">
              <h4>Advantages</h4>
              <ul className="list-group">
                {selectedDapit.advantage.map((adv, idx) => (
                  <li key={idx} className="list-group-item">{adv}</li>
                ))}
              </ul>
            </div>
            <div className="col-md-6">
              <h4>Disadvantages</h4>
              <ul className="list-group">
                {selectedDapit.disavantage.map((dis, idx) => (
                  <li key={idx} className="list-group-item">{dis}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-12">
              <h4>Summary</h4>
              <p>{selectedDapit.summerize}</p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <h4>Final Grade</h4>
              <p>{selectedDapit.finalGrade}</p>
            </div>
            <div className="col-md-6">
              <h4>Change to be Commander</h4>
              <p>{selectedDapit.changeToBeCommender}</p>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewDapit;
