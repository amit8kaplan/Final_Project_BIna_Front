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
import { useDataContext } from '../DataContext';
import {ITrainer, IDapit } from '../public/interfaces';
import { set } from 'react-hook-form';
import useSessionStorage from '../hooks/useSessionStorage';

export interface IDapitData {
    idInstractor: string,
    idTrainer:string,
    nameInstractor: string;
    nameTrainer: string;
    namePersonalInstractor: string;
    idPersonalInstractor: string;
    group: string;
    session: string;
    silabus: string | undefined ;
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
  onclose: () => void;
  theTrainer: string;
  theGroup: string;
  handleSubmit: (submitDapit: IDapitforSubmit) => void;
  theDapit: IDapit | undefined;
}

const AddDapit: React.FC<IAddDapitProps> = (props) => {
    const navigate = useNavigate();
    // const route = useRoute();
    const location = useLocation();
    const { groups, instructors, trainers, sessions , personalInstractors} =  useDataContext();
    const [group, setGroup] = useState<string>('');
    const state = location.state as IAddDapitProps || {};
    const contentRef = useRef<HTMLDivElement | null>(null);
    const theTrainer = state.theTrainer || props.theTrainer || '';
    const theGroup = state.theGroup || props.theGroup || '';
    const theDapit = state.theDapit || props.theDapit || '';
    const [trainerListByGroupBoolean, setTrainerListByGroupBoolean] = useState<boolean>(false);
    const [trainerListByGroup, setTrainerListByGroup] = useState<ITrainer[]>([]);
    const [groupListByTrainerBoolean, setGroupListByTrainerBoolean] = useState<boolean>(false);
    const [syllabusOptions, setSyllabusOptions] = useState<number[]>([]);
    const [validationMessage, setValidationMessage] = useState<string>('');
    const [validationMessage2, setValidationMessage2] = useState<string>('');
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const InstractorsComp = instructors || [];
    const trainersComp = trainers || [];
    const sessionsComp = sessions || [];
    const groupsComp = groups || [];
    const personalInstractorsComp = personalInstractors || [];
    console.log("Instractors: ", InstractorsComp)
    console.log("Trainers: ", trainersComp)
    console.log("Sessions: ", sessionsComp)
    console.log("groups: ", groupsComp)
    console.log("personalInstractors: ", personalInstractorsComp)
    console.log(theDapit, "theDapit in AddDapit");
    console.log("theDapit in AddDapit date", theDapit && theDapit.silabus ? theDapit.silabus : undefined);
    const clientID = useSessionStorage('client-id');
    const otp = useSessionStorage('otp');
    const permissions = useSessionStorage('permissions');

    const [selectedDate, setSelectedDate] = useState<Date | null>(theDapit && theDapit.date ? new Date(theDapit.date) : new Date());
    const [dapitData, setDapitData] = useState<IDapit>({
    date: theDapit && theDapit.date ? theDapit.date : new Date(),
    idInstractor: theDapit && theDapit.idInstractor ? theDapit.idInstractor : '',
    idTrainer: theDapit && theDapit.idTrainer ? theDapit.idTrainer : '',
    nameInstractor: theDapit && theDapit.nameInstractor ? theDapit.nameInstractor : '',
    nameTrainer: theDapit && theDapit.nameTrainer ? theDapit.nameTrainer : theTrainer,
    namePersonalInstractor: theDapit && theDapit.namePersonalInstractor ? theDapit.namePersonalInstractor : '',
    idPersonalInstractor: theDapit && theDapit.idPersonalInstractor ? theDapit.idPersonalInstractor : '',
    group: theDapit && theDapit.group ? theDapit.group : theGroup,
    session: theDapit && theDapit.session ? theDapit.session : '',
    silabus: theDapit && theDapit.silabus ? theDapit.silabus : undefined,
    tags: [''],
    identification: theDapit && theDapit.identification ? theDapit.identification.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    payload: theDapit && theDapit.payload ? theDapit.payload.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    decryption: theDapit && theDapit.decryption ? theDapit.decryption.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    workingMethod: theDapit && theDapit.workingMethod ? theDapit.workingMethod.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    understandingTheAir: theDapit && theDapit.understandingTheAir ? theDapit.understandingTheAir.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    flight: theDapit && theDapit.flight ? theDapit.flight.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    theoretical: theDapit && theDapit.theoretical ? theDapit.theoretical.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    thinkingInAir: theDapit && theDapit.thinkingInAir ? theDapit.thinkingInAir.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    safety: theDapit && theDapit.safety ? theDapit.safety.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    briefing: theDapit && theDapit.briefing ? theDapit.briefing.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    debriefing: theDapit && theDapit.debriefing ? theDapit.debriefing.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    debriefingInAir: theDapit && theDapit.debriefingInAir ? theDapit.debriefingInAir.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    implementationExecise: theDapit && theDapit.implementationExecise ? theDapit.implementationExecise.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    dealingWithFailures: theDapit && theDapit.dealingWithFailures ? theDapit.dealingWithFailures.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    dealingWithStress: theDapit && theDapit.dealingWithStress ? theDapit.dealingWithStress.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    makingDecisions: theDapit && theDapit.makingDecisions ? theDapit.makingDecisions.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    pilotNature: theDapit && theDapit.pilotNature ? theDapit.pilotNature.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    crewMember: theDapit && theDapit.crewMember ? theDapit.crewMember.map(item=>({
      value: Number(item.value) || undefined,
      description: item.description || ''
    })) : [{ value:  undefined, description: '' }],
    advantage: theDapit && theDapit.advantage ? theDapit.advantage : ['','',''],
    disavantage: theDapit && theDapit.disavantage ? theDapit.disavantage : ['','', '' ],
    summerize: theDapit && theDapit.summerize ? theDapit.summerize : '',
    finalGrade: theDapit && theDapit.finalGrade ? theDapit.finalGrade : undefined,
    changeTobeCommender: theDapit && theDapit.changeTobeCommender ? theDapit.changeTobeCommender : undefined,

  });
  useEffect(() => {
    console.log("AddDapit useEffect");
    if (isSubmitted) {
    const missingFields = [];
      if (!dapitData.nameInstractor) missingFields.push('Instractor');
      if (!dapitData.nameTrainer) missingFields.push('Trainer');
      if (!dapitData.idInstractor) missingFields.push('Instractor ID');
      if (!dapitData.idTrainer) missingFields.push('Trainer ID');
      if (!dapitData.group) missingFields.push('Group');
      if (!dapitData.session) missingFields.push('Session');
      if (!dapitData.silabus) missingFields.push('silabus');
      if (dapitData.finalGrade === undefined) missingFields.push('Final Grade');
      if (dapitData.changeTobeCommender === undefined) missingFields.push('Change to be Commander');
    
      if (missingFields.length > 0) {
        setValidationMessage(`Please fill in the following required fields:\n ${missingFields.join(', ')}`);
      } else {
        setValidationMessage('');
      }
      if (!clientID || !otp || !permissions) {
        setValidationMessage2('You must be logged in to submit a DAPIT');
      } else if (permissions !== 'admin' && clientID !== dapitData.idInstractor) {
        setValidationMessage2('you dont allow to submit a dapit of other Instractor');
      } else {
        setValidationMessage2('');
      }
    }
    if (theDapit && theDapit.silabus) {
      const selectedSession = sessionsComp.find(session => session.name === theDapit.session);
      if (selectedSession) {
        setSyllabusOptions(selectedSession.silabus);
      }
    }
  }, [dapitData,dapitData.nameInstractor, dapitData.nameTrainer,isSubmitted]);
  const toPDF = () => {
    const content = contentRef.current;
    const fileName = "Draft_dapit_of"+dapitData.nameTrainer+"_"+dapitData.session+"_"+dapitData.silabus+"_"+dapitData.nameInstractor;
    downloadPdf(content, fileName);
  };
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: string) => {
    const val = e.target.value;
    const value = e.target.value;
    let key: string | null = null;

    if (e.target instanceof HTMLSelectElement) {
      const selectedOption = e.target.selectedOptions[0];
      key = selectedOption.getAttribute('data-id');
    }

    console.log(`try11111 Key: ${key}, Value: ${value}`);
    console.log("e", e);
    console.log("handleChange val:", val);

    setDapitData({ ...dapitData, [field]: val });
    
    if (field === 'nameTrainer') {
      // setDapitData(prevData => ({ ...prevData, idTrainer: key || ''}));
      console.log ("group after nameTrainer val:",val);
      const selectedTrainer = trainersComp.find(trainer => trainer.name === val);
      if (selectedTrainer) {
        console.log("groupsComp group after nameTrainer:",groupsComp);
        console.log("group after nameTrainer selectedTrainer:",selectedTrainer);
        //add the trainer id to the dapitData
        setDapitData(prevData => ({ ...prevData, idTrainer: selectedTrainer._id! }));
        const group = groupsComp.find(group => group.idsTrainers?.includes(selectedTrainer._id!));
        console.log("group after nameTrainer:",group);
        if (group) {
          //add the group name
          setGroupListByTrainerBoolean(true);
          setDapitData(prevData => ({ ...prevData, group: group.name }));
        }
        else {
          setGroupListByTrainerBoolean(false);
          setDapitData(prevData => ({ ...prevData, group: '' }));
        }
        const idPersonalInstractor = personalInstractorsComp.find(personalInstractor => personalInstractor.idTrainer === selectedTrainer._id!);
        if (idPersonalInstractor) {

        //add the personalInstractor id to the dapitData
          setDapitData(prevData => ({ ...prevData, idPersonalInstractor: idPersonalInstractor?.idInstractor || ''  }));
          console.log("personal after nameTrainer idPersonalInstractor:",idPersonalInstractor);
          console.log ("personal after nameTrainer idInstractor:",idPersonalInstractor?.idInstractor);
          const personalName = InstractorsComp.find(Instractor => Instractor._id === idPersonalInstractor?.idInstractor);
          console.log("personal after nameTrainer personalName:",personalName);
          
          //add personal name to the dapitData
          setDapitData(prevData => ({ ...prevData, namePersonalInstractor: personalName?.name || '' }));
          console.log ("all after using DapitData: NameTrainer, personalName, group  ",dapitData.nameTrainer, dapitData.namePersonalInstractor, dapitData.group);
        }
        else {
          setDapitData(prevData => ({ ...prevData, idPersonalInstractor: '', namePersonalInstractor: '' }));
        }
      }
      else {
        setGroupListByTrainerBoolean(false);
        setDapitData(prevData => ({
          ...prevData,
          idPersonalInstractor: '',
          namePersonalInstractor: '', 
          group: ''
        }));
      }
    }
    if (field === 'nameInstractor') {
      const selectedInstractor = InstractorsComp.find(Instractor => Instractor.name === val);
      if (selectedInstractor) {
        //add the Instractor id to the dapitData
        setDapitData(prevData => ({ ...prevData, idInstractor: selectedInstractor._id! }));
      }
    }
    if (field === 'group') {
      console.log ("group after group val:",val);
      const theGroup = groupsComp.find(group => group.name === val);
      
      if (theGroup) {
        //add the group id to the dapitData
        const trainers = trainersComp.filter(trainer => theGroup.idsTrainers?.includes(trainer._id!));
        console.log("Trainers in the selected group:", trainers);
        setTrainerListByGroup(trainers);
        setTrainerListByGroupBoolean(true);
      }
      else {
        setTrainerListByGroupBoolean(false);
      }
      
    };
    if (field === 'session') {
      const selectedSession = sessionsComp.find(session => session.name === val);
      if (selectedSession) {
        setSyllabusOptions(selectedSession.silabus);
        setDapitData(prevData => ({ ...prevData, session: selectedSession.name }));
      } else {
        setSyllabusOptions([]);
        setDapitData(prevData => ({ ...prevData, session: '' }));
      }
    }
  };
 
  const handleNestedChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string, category: keyof IDapit) => {
    console.log("handleNestedChange ");
    console.log("handleNestedChange index:",index);
    console.log("handleNestedChange e:",e);
    console.log("handleNestedChange field:",field);
    console.log("handleNestedChange category:",category);
    if (dapitData[category]!=undefined){
      if (Array.isArray(dapitData[category])) {
          const updatedCategory = (dapitData[category] as Array<{ value: number | undefined, description: string }>).map((item, i) =>
            i === index ? { ...item, [field]: e.target.value } : item
          );
          console.log("handleNestedChange updatedCategory:",updatedCategory);
          setDapitData({ ...dapitData, [category]: updatedCategory });
      }
    }
  };
  
  const handleAdandDis =  (index: number, e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof IDapit) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!clientID || !otp || !permissions) {
      setValidationMessage2('You must be logged in to submit a DAPIT');
      return;
    }
    else if (permissions !== 'admin' && clientID !== dapitData.idInstractor) {
      setValidationMessage2('you dont allow to submit a dapit of other Instractor');
      return;
    }
    const missingFields = [];
    if (!dapitData.nameInstractor) missingFields.push('Instractor');
    if (!dapitData.nameTrainer) missingFields.push('Trainer');
    if (!dapitData.idInstractor) missingFields.push('Instractor ID');
    if (!dapitData.idTrainer) missingFields.push('Trainer ID');
    if (!dapitData.group) missingFields.push('Group');
    if (!dapitData.session) missingFields.push('Session');
    if (!dapitData.silabus) missingFields.push('silabus');
    if (dapitData.finalGrade === undefined) missingFields.push('Final Grade');
    if (dapitData.changeTobeCommender === undefined) missingFields.push('Change to be Commander');
    if (sessionStorage.getItem('client-id'))
    if (missingFields.length > 0) {
      setValidationMessage(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }
    try{
        //trainerID: trainerID, PersonalInstractorID: PersonalInstractorID, InstractorID: InstractorID, personalName: personalName
        // const {trainerID, PersonalInstractorID, InstractorID , personalName} = await getIdpersonalInstractor(dapitData.nameTrainer, dapitData.nameInstractor); 
        // console.log("trainerID:",trainerID)
        // console.log("PersonalInstractorID:",PersonalInstractorID)
        // console.log("InstractorID:",InstractorID)
        console.log("dapitData.changetobecoma:",dapitData.changeTobeCommender)
        const submitDapit: IDapitforSubmit = {
            nameInstractor: dapitData.nameInstractor,
            namePersonalInstractor: dapitData.namePersonalInstractor,
            nameTrainer: dapitData.nameTrainer,
            idPersonalInstractor: dapitData.idPersonalInstractor,
            idInstractor: dapitData.idInstractor,
            idTrainer: dapitData.idTrainer,
            group: dapitData.group,
            session: dapitData.session,
            silabus: dapitData.silabus,
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
        // await postDapit(submitDapit);
        // Reset the form to its initial state here
        setDapitData({
            date: new Date(),
            idInstractor: '',
            idTrainer: '',
            idPersonalInstractor: '',          
            nameInstractor: '',
            nameTrainer: '',
            namePersonalInstractor: '',
            group: '',
            session: '',
            silabus:undefined,
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
        props.handleSubmit(submitDapit);
        // handleOnClose();
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
    <Modal.Header style={{ fontSize: "20px" }} closeButton>
      <Button variant="secondary" className="float-start" onClick={toPDF}>
        Download PDF
      </Button>
      {validationMessage2 ? (
        <div style={{ color: 'red', marginTop: '10px', marginLeft: '5px', marginRight: '5px' }}>
          {validationMessage2.split('\n').map((msg, idx) => (
            <div key={idx}>{msg}</div>
          ))}
        </div>
      ) : (
        validationMessage && (
          <div style={{ color: 'red', marginTop: '10px', marginLeft: '5px', marginRight: '5px' }}>
            {validationMessage.split('\n').map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
          </div>
        )
      )}
    </Modal.Header>
      <Modal.Body>
        <div className="container" ref={contentRef}>
          <Row className="mb-3">
            <Col md={3}>
              <h4>Instractor</h4>
              <Form.Control as="select" value={dapitData.nameInstractor} onChange={(e) => handleChange(e, 'nameInstractor')}>
                <option value="">Select Instractor</option>
                {InstractorsComp.map((Instractor, idx) => (
                  <option key={Instractor._id!} value={Instractor.name} data-id={Instractor._id!}>
                    {Instractor.name}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={3}>
              <h4>Trainer</h4>
              <Form.Control as="select" value={dapitData.nameTrainer} onChange={(e) => handleChange(e, 'nameTrainer')}>
                <option value="">Select Trainer</option>
                {trainerListByGroupBoolean ? (
                  trainerListByGroup.map((trainer) => (
                    <option key={trainer._id!} value={trainer.name} data-id={trainer._id!}>
                      {trainer.name}
                    </option>
                  ))
                ) : (
                  trainers.map((trainer) => (
                    <option key={trainer._id!} value={trainer.name} data-id={trainer._id!}>
                      {trainer.name}
                    </option>
                  ))
                )}
              </Form.Control>
            </Col>
            <Col md={3}>
              <h4>Personal Instractor</h4>
              <Form.Control type="text" value={dapitData.namePersonalInstractor} disabled={true} onChange={(e) => handleChange(e, 'namePersonalInstractor')} />
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
            <Form.Control 
              as="select" 
              value={dapitData.group} 
              onChange={(e) => handleChange(e, 'group')}
              disabled={groupListByTrainerBoolean} // Disable if groupListByTrainerBoolean is true
            >
              <option value="">Select Group</option>
              {groupsComp.map((group) => (
                <option key={group._id!} value={group.name} data-id={group._id!}>
                  {group.name}
                </option>
              ))}
            </Form.Control>
          </Col>
            <Col md={4}>
              <h4>Session</h4>
              <Form.Control as="select" value={dapitData.session} onChange={(e) => handleChange(e, 'session')}>
                <option value="">Select Session</option>
                {sessionsComp.map((session, idx) => (
                  <option key={session._id} value={session.name} data-id={session._id!}>
                    {session.name}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col md={4}>
              <h4>Syllabus</h4>
              <Form.Control
                as="select"
                value={dapitData.silabus}
                onChange={(e) => handleChange(e, 'syllabus')}
              >
                <option value="">Select Syllabus</option>
                {syllabusOptions.map((silabus, idx) => (
                  <option key={idx} value={silabus}>
                    {silabus}
                  </option>
                ))}
              </Form.Control>
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
