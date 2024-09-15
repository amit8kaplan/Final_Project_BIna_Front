import React, { useState, useEffect } from 'react';
import useSessionStorage from '../hooks/useSessionStorage';
import { useDataContext } from '../DataContext';
import { Button, Row, Col } from 'react-bootstrap';
import AdminTrainer from '../components/AdminTraienr'
import AdminInstructor from '../components/adminInstructor';
import AdminPersonalInstructor from '../components/AdminPersonalInstructor';
import AdminGroup from '../components/AdminGroup';
import AdminSession from '../components/AdminSession';

const Administrator: React.FC = () => {
    const [show, setShow] = useState(false);
    const permission = useSessionStorage('permissions');
    useEffect(() => {
        if (permission === 'admin') {
            setShow(true);
        } else {
            setShow(false);
        }
    }, [permission]);

    
   
    return (
        <div className="container">
            {show ? (
                <div className="" style={{marginTop: "40px" }}>
                    <Row className="mb-4">
                        <Col>
                            <AdminTrainer />
                        </Col>
                        <Col>
                            <AdminInstructor />
                        </Col>
                        <Col>
                            <AdminPersonalInstructor />
                        </Col>
                        
                    </Row>
                    <Row className='mb-4'>
                        <Col>
                            <AdminGroup />
                        </Col>
                        <Col>
                            <AdminSession />
                        </Col>
                    </Row>
                </div>
            ) : (
                <div>No Admin Access</div>
            )}
        </div>
    );
};

export default Administrator;