import React, { useState, useEffect } from 'react';
import { ICookie, IInstractor } from "../public/interfaces";
import { useDataContext } from '../DataContext';
import { Button, Modal, Dropdown } from 'react-bootstrap';
import useSessionStorage from '../hooks/useSessionStorage';
import { getAllCookies,addMoreTimeToCookie } from "../services/cookies-service";
import SessionModal from './SessionModal';
const AllSessions: React.FC = () => {
    const { instructors } = useDataContext();
    const cookies = getAllCookies();
    const clientId = useSessionStorage('client-id');
    const permissions = useSessionStorage('permissions');
    const otp = useSessionStorage('otp');
    console.log("all useSessionStorage:", clientId, permissions, otp);
    const [showModal, setShowModal] = useState(false);
    const [showNewSession, setShowNewSession] = useState(false);

    const [validCookies, setValidCookies] = useState<ICookie[]>([]);
    const [theOpenSession, setTheOpenSession] = useState<ICookie>();
    const [theOpenSessionFlag, setTheOpenSessionFlag] = useState(false);
    const [showMoreTimeOptions, setShowMoreTimeOptions] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showChangeSessionOptions, setShowChangeSessionOptions] = useState(false);
    const [selectedTime, setSelectedTime] = useState<number>(0);
    const [selectedSession, setSelectedSession] = useState<string>('');

    useEffect(() => {
        fetchAllCookies();
        fetchWhoIsTheHeader();
    }, [instructors, clientId]);

    const fetchAllCookies = async () => {
        const cookies: ICookie[] = getAllCookies();
        const validCookiesinFetch = cookies.filter(cookie => 
            instructors.some(instructor => instructor._id === cookie.idInstractor)
        );
        setValidCookies(validCookiesinFetch);
    };

    const fetchWhoIsTheHeader = async () => {
        if (clientId) {
            const TheOpen = validCookies.find(cookie => cookie.idInstractor === clientId);
            setTheOpenSession(TheOpen);
            setTheOpenSessionFlag(true);
        }
    };

    const handleShow = () => setShowModal(true);
    const handleShowNewSession = () => setShowNewSession(true);

    const handleClose = () => {
        setShowModal(false);
        setShowMoreTimeOptions(false);
        setShowDeleteConfirmation(false);
        setShowChangeSessionOptions(false);
    };

    const handleGetMoreTime = () => {
        setShowMoreTimeOptions(true);
        
        setShowDeleteConfirmation(false);
        setShowChangeSessionOptions(false);
    };

    const handleDeleteSession = () => {
        setShowMoreTimeOptions(false);
        setShowDeleteConfirmation(true);
        setShowChangeSessionOptions(false);
    };

    const handleChangeSession = () => {
        setShowMoreTimeOptions(false);
        setShowDeleteConfirmation(false);
        setShowChangeSessionOptions(true);
    };

    const handleSubmitMoreTime = () => {
        // Logic to add more time to the cookie
        console.log('addMoreTimeToCookie More time added:', selectedTime);
        console.log(" addMoreTimeToCookie selectedTime:", selectedTime);
        console.log(" addMoreTimeToCookie validCookies[0].name && validCookies[0].idInstractor && otp &&", validCookies[0].name, validCookies[0].idInstractor, otp);
        if (validCookies[0].name && validCookies[0].idInstractor && otp &&  validCookies[0].idInstractor!="" && validCookies[0].name!="" && otp!="") {
            addMoreTimeToCookie(validCookies[0].name,validCookies[0].idInstractor, otp, selectedTime);
        }
        else {
            console.log("Error in addMoreTimeToCookie");
        }
        handleClose();
    };

    const handleConfirmDelete = () => {
        // Logic to delete the session cookie
        console.log('Session deleted:', theOpenSession);
        handleClose();
    };

    const handleSubmitChangeSession = () => {
        // Logic to change the session
        console.log('Session changed to:', selectedSession, 'with OTP:', otp);
        handleClose();
    };

    return (
        <div>
            <Button variant="primary" onClick={handleShow}>Session</Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Session Details</Modal.Title>
                    {/* <Button className="m-1"variant="primary" size="sm" onClick={handleShowNewSession}>
                        Open Session
                    </Button> */}
                    <SessionModal handleCloseFather={handleClose}/>
                </Modal.Header>
                <Modal.Body>
           
                    {theOpenSessionFlag && theOpenSession && (
                        <div>
                            <p><strong>Name:</strong> {theOpenSession.name}</p>
                            <p><strong>TTL:</strong> {(parseInt(theOpenSession.ttl) / 3600).toFixed(2)} hours</p>
                            {!showMoreTimeOptions && !showDeleteConfirmation && !showChangeSessionOptions && (
                                <div>
                                    <Button variant="secondary" onClick={handleGetMoreTime}>Get More Time</Button>
                                    <Button variant="danger" onClick={handleDeleteSession} style={{ marginLeft: '10px' }}>Delete Session</Button>
                                </div>
                            )}
                            {showMoreTimeOptions && (
                                <div>
                                    <Dropdown onSelect={(e) => setSelectedTime(Number(e))}>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            Select Time
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item eventKey="1">1 Hour</Dropdown.Item>
                                            <Dropdown.Item eventKey="2">2 Hours</Dropdown.Item>
                                            <Dropdown.Item eventKey="3">3 Hours</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <Button variant="primary" onClick={handleSubmitMoreTime} style={{ marginTop: '10px' }}>Submit</Button>
                                </div>
                            )}
                            {showDeleteConfirmation && (
                                <div>
                                    <p>Are you sure you want to delete this session?</p>
                                    <Button variant="danger" onClick={handleConfirmDelete}>Yes, Delete</Button>
                                </div>
                            )}
                            {showChangeSessionOptions && (
                                <div>
                                    <Dropdown onSelect={(e) => setSelectedSession(e || '')}>
                                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                                            Select Session
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            {validCookies.map((cookie, index) => (
                                                <Dropdown.Item key={index} eventKey={cookie.idInstractor}>{cookie.name}</Dropdown.Item>
                                            ))}
                                        </Dropdown.Menu>
                                    </Dropdown>
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        style={{ marginTop: '10px', display: 'block' }}
                                    />
                                    <Button variant="primary" onClick={handleSubmitChangeSession} style={{ marginTop: '10px' }}>Submit</Button>
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="warning" onClick={handleChangeSession} style={{ marginLeft: '10px' }}>Change Session</Button>

                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AllSessions;