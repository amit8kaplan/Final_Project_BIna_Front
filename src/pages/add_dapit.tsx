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
import AddDapit from '../components/AddDapit';
import { useDataContext } from '../DataContext';

import {defaultInstractor, defaultTrainer} from "../public/interfaces"

interface IAddDapitProps {
  onclose: () => void;
}

const AddDapitPage: React.FC<IAddDapitProps> = (props) => {
  const [showAddDapit, setShowAddDapit] = useState(true);
  const navigate = useNavigate();
  const handleCloseAddDapit = () => {
    setShowAddDapit(false);
    navigate("/");
  };
  const handleSubmitInAdd_dapit = async (submitDapit: IDapitforSubmit) =>{
    //console.log("the submit dapit is",submitDapit);
    await postDapit(submitDapit);
    handleCloseAddDapit();
  };
  return (
    <div>{showAddDapit && (
      <AddDapit  
          onclose={handleCloseAddDapit}
          theGroup=''
          theTrainer= {defaultTrainer}
          thePesonalINstractor = {defaultInstractor}
          theDapit={undefined}
          handleSubmit={handleSubmitInAdd_dapit} /> 
    )} 
    </div>   
  );
}
export default AddDapitPage;

