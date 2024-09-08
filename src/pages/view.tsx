import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Sidebar_com } from '../components/sideBar_views';
import ViewDapit from '../components/view_Dapit';
import { handleFiltersSubmit } from '../services/dapit-serivce';
import { borderLeftStyle } from 'html2canvas/dist/types/css/property-descriptors/border-style';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import AddDapit from '../components/AddDapit';
import { set } from 'react-hook-form';
import {IDapitforSubmit, ChangeData }from '../services/dapit-serivce';
import { IDapit } from '../public/interfaces';
import useSessionStorage from '../hooks/useSessionStorage';
interface Dapit {
  idInstractor: string;
  _id?: string;
  nameInstractor: string;
  namePersonalInstractor: string;
  idPersonalInstructor: string;
  nameTrainer: string;
  group: string;
  session: string | undefined;
  silabus: number |undefined;
  finalGrade: number | undefined;
  changeToBeCommender: number | undefined;
}

interface DetailedDapit extends Dapit {
  tags: string[];
  nameTrainer: string;
  silabus: number | undefined;
  idTrainer: string;
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
  changeToBeCommender: number | undefined;
  finalGrade: number |undefined;
  date: Date;
}

const View: React.FC = () => {
  const [filters, setFilters] = useState<any>(null);
  const [showEditDapit, setShowEditDapit] = useState(false);
  const [dapits, setDapits] = useState<Dapit[]>([]);
  const [dapitInIdapit, setDapitInIdapit] = useState<IDapit[]>([]);
  const [selectedDapit, setSelectedDapit] = useState<DetailedDapit | null>(null);
  const [editDapit, setEditDapit] = useState<IDapit | undefined>(undefined);
  const clientId = useSessionStorage("client-id");
  const permission = useSessionStorage("permission") || 'regular';
  useEffect(() => {
    fetchInitialDapits();
  }, [showEditDapit]);

  const fetchInitialDapits = async () => {
    try {
      const fetchedDapits = await handleFiltersSubmit({});
      setDapitInIdapit(fetchedDapits);
      const transformDapits = fetchedDapits.map(transformIdapitToDapit);
      setDapits(transformDapits);
    } catch (error) {
      console.error('Error fetching initial dapits:', error);
    }
  };

  const handleFilterSubmitinFront = async (filters: any) => {
    console.log("handleFilterSubmitinFront: ", filters)
    console.log("handleFilterSubmitinFront filters: ", filters)

    try {
      const filteredDapits = await handleFiltersSubmit(filters);
      console.log("handleFilterSubmitinFront filteredDapits: ", filteredDapits)
      setDapits(filteredDapits);
    } catch (error) {
      console.error('Error fetching filtered dapits:', error);
    }
  };
  const getCellStyle = (value: number | undefined) => {
    if (!value) {
      return {}; // Return default style when no value is present (e.g., on backspace)
    }
    else if (value === 10) return { backgroundColor: 'forestgreen', color: 'black' };
    else if (value === 9) return { backgroundColor: 'limegreen', color: 'black' };
    else if (value === 8) return { backgroundColor: 'lightgreen', color: 'black' };
    else if (value === 7) return { backgroundColor: 'silver', color: 'black' };
    else if (value === 6) return { backgroundColor: 'khaki' };
    else if (value === 5) return { backgroundColor: 'lightpink' };
    else if (value === 4) return { backgroundColor: 'lightcoral' };
  
    return {};
  };
  const transformIdapitToDapit = (idapit: IDapit): Dapit => {
    const dapit: Dapit = {
      nameInstractor: idapit.nameInstractor,
      namePersonalInstractor: idapit.namePersonalInstractor,
      nameTrainer: idapit.nameTrainer,
      group: idapit.group,
      idPersonalInstructor: idapit.idPersonalInstractor,
      _id: idapit._id? idapit._id : '',
      idInstractor: idapit.idInstractor,
      session: idapit.session || '',
      silabus: idapit.silabus || 0,
      finalGrade: idapit.finalGrade || 0,
      changeToBeCommender: idapit.changeTobeCommender || 0,
    };
    return dapit;
  }

  const transformDetailedDapitToIdapit = (dapit: DetailedDapit): IDapit => {
    
    const idapit: IDapit = {
      nameInstractor: dapit.nameInstractor,
      namePersonalInstractor: dapit.namePersonalInstractor,
      nameTrainer: dapit.nameTrainer,
      group: dapit.group,
      idPersonalInstractor: dapit.idPersonalInstructor,
      _id: dapit._id,
      idInstractor: dapit.idInstractor,
      idTrainer:dapit.idTrainer,
      session: dapit.session,
      silabus: dapit.silabus,
      date: new Date(dapit.date),
      tags: dapit.tags,
      identification: dapit.identification,
      payload: dapit.payload,
      decryption: dapit.decryption,
      workingMethod: dapit.workingMethod,
      understandingTheAir: dapit.understandingTheAir,
      flight: dapit.flight,
      theoretical: dapit.theoretical,
      thinkingInAir: dapit.thinkingInAir,
      safety: dapit.safety,
      briefing: dapit.briefing,
      debriefing: dapit.debriefing,
      debriefingInAir: dapit.debriefingInAir,
      implementationExecise: dapit.implementationExecise,
      dealingWithFailures: dapit.dealingWithFailures,
      dealingWithStress: dapit.dealingWithStress,
      makingDecisions: dapit.makingDecisions,
      pilotNature: dapit.pilotNature,
      crewMember: dapit.crewMember,
      advantage: dapit.advantage,
      disavantage: dapit.disavantage,
      changeTobeCommender: dapit.changeToBeCommender,
      finalGrade: dapit.finalGrade,
      summerize: dapit.summerize,
    };
    return idapit;
  }
  const transformIDapitToDeatiledDapit = (idapit: IDapit): DetailedDapit => {
    console.log("transformIDapitToDeatiledDapit: ", idapit)
    const dapit: DetailedDapit = {
      idInstractor: idapit.idInstractor,
      _id: idapit._id,
      idTrainer: idapit.idTrainer,
      idPersonalInstructor: idapit.idPersonalInstractor,
      nameInstractor: idapit.nameInstractor,
      namePersonalInstractor: idapit.namePersonalInstractor,
      nameTrainer: idapit.nameTrainer,
      group: idapit.group,
      session: idapit.session,
      silabus: idapit.silabus,
      finalGrade: idapit.finalGrade,
      changeToBeCommender: idapit.changeTobeCommender,
      tags: idapit.tags || [],
      date: idapit.date,
      identification: idapit.identification.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      payload: idapit.payload.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      decryption: idapit.decryption.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      workingMethod: idapit.workingMethod.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      understandingTheAir: idapit.understandingTheAir.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      flight: idapit.flight.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      theoretical: idapit.theoretical.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      thinkingInAir: idapit.thinkingInAir.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      safety: idapit.safety.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      briefing: idapit.briefing.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      debriefing: idapit.debriefing.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      debriefingInAir: idapit.debriefingInAir.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      implementationExecise: idapit.implementationExecise.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      dealingWithFailures: idapit.dealingWithFailures.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      dealingWithStress: idapit.dealingWithStress.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      makingDecisions: idapit.makingDecisions.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      pilotNature: idapit.pilotNature.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      crewMember: idapit.crewMember.map(item => ({
        value: item.value ?? 0, // Provide a default value if undefined
        description: item.description,
      })),
      advantage: idapit.advantage,
      disavantage: idapit.disavantage,
      summerize: idapit.summerize,
    };
  
    return dapit;
  };
  const handleRowClick = (id: string) => {

    // Fetch detailed data for the selected dapit
    try{ 
        const rowdapit :IDapit | undefined = dapitInIdapit.find(dapit => dapit._id === id);
        let detailsDapit: DetailedDapit | undefined;
        console.log("handleRowClick: ", rowdapit)
        if (rowdapit){
          detailsDapit = transformIDapitToDeatiledDapit(rowdapit);
          console.log("all the dates: ", detailsDapit)
          setSelectedDapit(detailsDapit);
        }
      }
    catch (error) {
      console.error('Error fetching detailed dapit:', error);
    }
  };
  const handleCloseModal = () => {
    setSelectedDapit(null);
  };
  const handleCloseEditDapit = () => {
    setShowEditDapit(false);
  }
  const handleEditDapit = (id: string) => {
    try{
      const editDapit = dapitInIdapit.find(dapit => dapit._id === id);
      console.log("handleEditDapit: ", editDapit)
      setEditDapit(editDapit);
      setShowEditDapit(true);        

    }catch (error) {
      console.error('Error fetching detailed dapit:', error);
    }
  }
  const handleSubmitInView = async (submitDapit: IDapitforSubmit) =>{
    console.log("handleSubmitInView: ", submitDapit)
    try{
      submitDapit._id = editDapit?._id;
      const response = await ChangeData(submitDapit);
      console.log("handleSubmitInView response: ", response)
      handleCloseEditDapit();
    }catch (error) {
      console.error('Error posting dapit:', error);
    }
  }
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
                <tr key={dapit._id}>
                  <td onClick={() => handleRowClick(dapit._id ?? '')} style={getCellStyle(dapit.finalGrade || undefined)}>{dapit.nameTrainer}</td>
                  <td onClick={() => handleRowClick(dapit._id ?? '')} style={getCellStyle(dapit.finalGrade || undefined)}>{dapit.nameInstractor}</td>
                  <td onClick={() => handleRowClick(dapit._id ?? '')} style={getCellStyle(dapit.finalGrade || undefined)}>{dapit.group}</td>
                  <td onClick={() => handleRowClick(dapit._id ?? '')} style={getCellStyle(dapit.finalGrade || undefined)}>{dapit.session}</td>
                  <td onClick={() => handleRowClick(dapit._id ?? '')} style={getCellStyle(dapit.finalGrade || undefined)}>{dapit.silabus}</td>
                  <td onClick={() => handleRowClick(dapit._id ?? '')} style={getCellStyle(dapit.finalGrade || undefined)}>{dapit.finalGrade}</td>
                  <td onClick={() => handleRowClick(dapit._id ?? '')} style={getCellStyle(dapit.finalGrade || undefined)}>{dapit.changeToBeCommender}</td>
                  {(permission === 'admin' && clientId) || dapit.idInstractor === clientId ? (
                    <td>
                      <FontAwesomeIcon icon={faPen} onClick={() => handleEditDapit(dapit._id ?? '')} />
                    </td>
                  ) : null}
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
      {showEditDapit && (
            <AddDapit
            theDapit={editDapit}
            onclose={handleCloseEditDapit}
            theGroup=''
            theTrainer=''
            handleSubmit={handleSubmitInView}
          />
        )}
    </div>
  );
}

export default View;
