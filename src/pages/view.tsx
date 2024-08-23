import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Sidebar_com } from '../components/sideBar_views';
import ViewDapit from '../components/view_Dapit';
import { handleFiltersSubmit } from '../services/dapit-serivce';
interface Dapit {
  _id: string;
  nameInstractor: string;
  namePersonalInstructor: string;
  nameTrainer: string;
  group: string;
  session: string;
  silabus: number;
  finalGrade: number;
  changeTobeCommender: number;
}

interface DetailedDapit extends Dapit {
  tags: string[];
  nameInstructor: string;
  namePersonalInstructor: string;
  nameTrainer: string;
  silabus: number;

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
  changeToBeCommender: number;
  finalGrade: number;

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

  const handleRowClick = (id: string) => {
    // Fetch detailed data for the selected dapit
    try{ 
        const detailedDapit = dapits.find(dapit => dapit._id === id);
        setSelectedDapit(detailedDapit as DetailedDapit);



      }
    catch (error) {
      console.error('Error fetching detailed dapit:', error);
    }
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
                  <th>silabus</th>
                  <th>Final Grade</th>
                  <th>Change to be Commander</th>
                </tr>
              </thead>
              <tbody>
                {dapits.map(dapit => (
                  <tr key={dapit._id}  onClick={() => handleRowClick(dapit._id)}>
                    <td style={getCellStyle(dapit.finalGrade || undefined)}>{dapit.nameTrainer}</td>
                    <td style={getCellStyle(dapit.finalGrade || undefined)}>{dapit.nameInstractor}</td>
                    <td style={getCellStyle(dapit.finalGrade || undefined)}>{dapit.group}</td>
                    <td style={getCellStyle(dapit.finalGrade || undefined)}>{dapit.session}</td>
                    <td style={getCellStyle(dapit.finalGrade || undefined)} >{dapit.silabus}</td>
                    <td style={getCellStyle(dapit.finalGrade || undefined)}>{dapit.finalGrade}</td>
                    <td style={getCellStyle(dapit.finalGrade || undefined)}>{dapit.changeTobeCommender}</td>
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
