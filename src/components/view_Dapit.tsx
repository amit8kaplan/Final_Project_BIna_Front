import React, { useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/add_dapit.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { downloadPdf } from '../services/pdf-service';
interface IData {
  value: number;
  description: string;
}

interface IDapitProps {
  selectedDapit: {
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
  onClose: () => void;
}

const ViewDapit: React.FC<IDapitProps> = ({ selectedDapit, onClose }) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const dateGoodFormat = new Date(selectedDapit.date).toISOString().split('T')[0];
  const onEmail = () => {
    console.log('Emailing dapit details');
  };

  useEffect(() => {
    console.log('selectedDapit: ', selectedDapit);
  }, [selectedDapit]);

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
                  <li key={idx} className="list-group-item" style={getCellStyle(data.value || undefined)}>
                    {data.value !== undefined ? (
                      <strong>{data.value}</strong>
                    ) : null}
                    <span style={{ color: data.value !== undefined ? 'inherit' : 'white' }}>:</span>
                  </li>
                ))}
              </ul>
            </div>
            {index + 1 < ratingCategories.length && (
              <div className="col-md-6">
                <h5>{ratingCategories[index + 1].title}</h5>
                <ul className="list-group">
                  {ratingCategories[index + 1].data.map((data, idx) => (
                    <li key={idx} className="list-group-item" style={getCellStyle(data.value || undefined)}>
                      {data.value !== undefined ? (
                        <strong>{data.value}</strong>
                      ) : null}
                      <span style={{ color: data.value !== undefined ? 'inherit' : 'white' }}>:</span>
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

  const getCellStyle = (value: number | undefined) => {
    if (!value) {
      return {}; // Return default style when no value is present (e.g., on backspace)
    } else if (value === 10) return { backgroundColor: 'forestgreen', color: 'black' };
    else if (value === 9) return { backgroundColor: 'limegreen', color: 'black' };
    else if (value === 8) return { backgroundColor: 'lightgreen', color: 'black' };
    else if (value === 7) return { backgroundColor: 'silver', color: 'black' };
    else if (value === 6) return { backgroundColor: 'khaki' };
    else if (value === 5) return { backgroundColor: 'lightpink' };
    else if (value === 4) return { backgroundColor: 'lightcoral' };
  
    return {};
  };

  const toPDF = () => {
    const content = contentRef.current;
    const fileName = "Dapit_Of_"+selectedDapit.nameTrainer+"_"+selectedDapit.session+"_"+selectedDapit.silabus+"_"+dateGoodFormat;
    downloadPdf(content, fileName);
    // if (content) {
    //   html2canvas(content, { scale: 2 }).then(canvas => {
    //     const imgData = canvas.toDataURL('image/png');
    //     const pdf = new jsPDF({
    //       orientation: 'portrait',
    //       unit: 'mm',
    //       format: 'a4',
    //     });
    //     const imgWidth = 210;
    //     const imgHeight = (canvas.height * imgWidth) / canvas.width;
    //     pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    //     pdf.save('dapit_details.pdf');
    //   });
    // }
  };

  return (
    <Modal show={true} onHide={onClose} size="xl" style={{ fontSize: '0.9em', overflowY: 'auto' }}>
      <Modal.Header closeButton>
        <div className="container">
          <Button variant="secondary" className="float-start" onClick={toPDF}>
            Download PDF
          </Button>
        </div>
      </Modal.Header>
      <Modal.Body>
        <div className="container" ref={contentRef}>
          <div className="row mb-3">
            <div className="col-md-3">
              <h4>Instructor</h4>
              <p>{selectedDapit.nameInstractor}</p>
            </div>
            <div className="col-md-3">
              <h4>Trainer</h4>
              <p>{selectedDapit.nameTrainer}</p>
            </div>
            <div className="col-md-3">
              <h4>Personal Instructor</h4>
              <p>{selectedDapit.namePersonalInstractor}</p>
            </div>
            <div className="col-md-3">
              <h4>Date</h4>
              <p>{dateGoodFormat}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4">
              <h4>Group</h4>
              <p>{selectedDapit.group}</p>
            </div>
            <div className="col-md-4">
              <h4>Session</h4>
              <p>{selectedDapit.session}</p>
            </div>
            <div className="col-md-4">
              <h4>Syllabus</h4>
              <p>{selectedDapit.silabus}</p>
            </div>
          </div>
          <div style={{borderTop: "6px dotted lightgray", borderBottom: "6px dotted lightgray"}}>
            <h4 className="h4style">Detailed Ratings</h4>
            {renderDetailedRatings()}
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <h4>Advantages</h4>
              <ul className="list-group">
                {selectedDapit.advantage.map((adv, idx) => (
                  <li key={idx} className="list-group-item" style={{ color: adv.length > 0 ? 'inherit' : 'white' }}>
                    {adv.length > 0 ? adv : ':'}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-md-6">
              <h4>Disadvantages</h4>
              <ul className="list-group">
                {selectedDapit.disavantage.map((dis, idx) => (
                  <li key={idx} className="list-group-item" style={{ color: dis.length > 0 ? 'inherit' : 'white' }}>
                    {dis.length > 0 ? dis : ':'}
                  </li>
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
              <ul className="list-group">
                <li className="list-group-item" style={getCellStyle(selectedDapit.finalGrade || undefined)}>
                  <strong>{selectedDapit.finalGrade}</strong>
                </li>
              </ul>
            </div>
            {/* <li key={idx} className="list-group-item" style={getCellStyle(data.value || undefined)}>
                    {data.value !== undefined ? (
                      <strong>{data.value}</strong>
                    ) : null}
                    <span style={{ color: data.value !== undefined ? 'inherit' : 'white' }}>:</span>
                  </li> */}
            <div className="col-md-6">
            <h4>Change to be Commander</h4>
              <ul className="list-group">
                <li className="list-group-item" style={getCellStyle(selectedDapit.changeTobeCommender || undefined)}>
                  <strong>{selectedDapit.changeTobeCommender}</strong>
                </li>
              </ul>
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
