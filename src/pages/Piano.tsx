import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ViewDapit from '../components/view_Dapit'; // Assuming you have a ViewDapit component
import { useLocation, useNavigate } from 'react-router-dom';


interface IpianoProps{
    group: string;
}

 export const Piano: React.FC<IpianoProps> = (props) => {
    const location = useLocation();
    const state = location.state as IpianoProps || {};
    const group = state.group || props.group;
    console.log(group);

    return (
        <div>
            <h1>{group}</h1>
        </div>
    );
}
