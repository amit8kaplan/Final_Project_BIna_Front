// View.tsx
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Sidebar_com } from '../components/sideBar_views';
import ViewDapit from '../components/view_Dapit';
import  {handleFiltersSubmit}  from '../services/dapit-serivce';
interface Dapit {
  _id: string;
  nameInstructor: string;
  namePersonalInstructor: string;
  nameTrainer: string;
  group: string;
  session: string;
  syllabus: number;
  finalGrade: number;
  changeToBeCommender: number;
}

interface DetailedDapit extends Dapit {
  tags: string[];
  identification: { value: number; description: string }[];
  payload: { value: number; description: string }[];
  decryption: { value: number; description: string }[];
  workingMethod: { value: number; description: string }[];
  understandingTheAir: { value: number; description: string }[];
  flight: { value: number; description: string }[];
  theoretical: { value: number; description: string }[];
  thinkingInAir: { value: number; description: string }[];
  safety: { value: number; description: string }[];
  briefing: { value: number; description: string }[];
  debriefing: { value: number; description: string }[];
  debriefingInAir: { value: number; description: string }[];
  implementationExecise: { value: number; description: string }[];
  dealingWithFailures: { value: number; description: string }[];
  dealingWithStress: { value: number; description: string }[];
  makingDecisions: { value: number; description: string }[];
  pilotNature: { value: number; description: string }[];
  crewMember: { value: number; description: string }[];
  advantage: string[];
  disavantage: string[];
  summerize: string;
  date: string;
}

const View: React.FC = () => {
  const [filters, setFilters] = useState<any>(null);
  const [dapits, setDapits] = useState<Dapit[]>([]);
  const [selectedDapit, setSelectedDapit] = useState<DetailedDapit | null>(null);

  useEffect(() => {
    fetchInitialDapits();
  }, []);

  const fetchInitialDapits = async () => {
    try {
      const fetchedDapits = await handleFiltersSubmit({});
      setDapits(fetchedDapits);
    } catch (error) {
      console.error('Error fetching initial dapits:', error);
    }
  };

  const handleFilterSubmitinFront = async (filters: any) => {
    console.log("handleFilterSubmitinFront: ", filters)
    console.log("filters: ", filters)

    try {
      const filteredDapits = await handleFiltersSubmit(filters);
      setDapits(filteredDapits);
    } catch (error) {
      console.error('Error fetching filtered dapits:', error);
    }
  };


  const handleRowClick = (id: string) => {
    // Fetch detailed data for the selected dapit
    const detailedDapit: DetailedDapit = {
      _id: "6676f72a25f53ea3cbaf023b",
      nameInstructor: "Jonh Doe",
      namePersonalInstructor: "Kaplan",
      nameTrainer: "Moshiko",
      group: "A",
      session: "A",
      syllabus: 1,
      finalGrade: 8,
      changeToBeCommender: 9,
      tags: ["tag1", "tag2"],
      identification: [{ value: 4, description: "good" }],
      payload: [{ value: 5, description: "good" }],
      decryption: [{ value: 6, description: "good" }],
      workingMethod: [{ value: 7, description: "good" }],
      understandingTheAir: [{ value: 8, description: "good" }],
      flight: [{ value: 9, description: "good" }],
      theoretical: [{ value: 10, description: "good" }],
      thinkingInAir: [{ value: 4, description: "good" }],
      safety: [{ value: 5, description: "good" }],
      briefing: [{ value: 6, description: "good" }],
      debriefing: [{ value: 7, description: "good" }],
      debriefingInAir: [{ value: 8, description: "good" }],
      implementationExecise: [{ value: 9, description: "good" }],
      dealingWithFailures: [{ value: 10, description: "good" }],
      dealingWithStress: [{ value: 4, description: "good" }],
      makingDecisions: [{ value: 5, description: "good" }],
      pilotNature: [{ value: 6, description: "good" }],
      crewMember: [{ value: 7, description: "good" }],
      advantage: ["advantage1", "advantage2"],
      disavantage: ["disavantage1", "disavantage2"],
      summerize: "good",
      date: "2022-01-01T00:00:00.000Z"
    };
    setSelectedDapit(detailedDapit);
  };

  const handleCloseModal = () => {
    setSelectedDapit(null);
  };
  return (
    <div className="d-flex">
      <Sidebar_com onSubmit={handleFilterSubmitinFront} />

      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <h3>Dapits List</h3>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Trainer</th>
                  <th>Instructor</th>
                  <th>Group</th>
                  <th>Session</th>
                  <th>Syllabus</th>
                  <th>Final Grade</th>
                  <th>Change to be Commander</th>
                </tr>
              </thead>
              <tbody>
                {dapits.map(dapit => (
                  <tr key={dapit._id} onClick={() => handleRowClick(dapit._id)}>
                    <td>{dapit.nameTrainer}</td>
                    <td>{dapit.nameInstructor}</td>
                    <td>{dapit.group}</td>
                    <td>{dapit.session}</td>
                    <td>{dapit.syllabus}</td>
                    <td>{dapit.finalGrade}</td>
                    <td>{dapit.changeToBeCommender}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedDapit && (
        <ViewDapit selectedDapit={selectedDapit} onClose={handleCloseModal} />
      )}
    </div>
  );
}

export default View;

