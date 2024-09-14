import React, { useState, useEffect } from 'react';
import { ICookie, IInstractor } from "../public/interfaces";
import { useDataContext } from '../DataContext';
import { Button, Modal, Dropdown } from 'react-bootstrap';
import useSessionStorage from '../hooks/useSessionStorage';
import { getAllCookies, addMoreTimeToCookie } from "../services/cookies-service";
import SessionModal from './SessionModal';
import {verifyOtpAgain, getAllsession} from "../services/session-service";
import { setAuthHeaders,setPermissions } from '../public/data';
import { set } from 'react-hook-form';

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
    const [selectedSession, setSelectedSession] = useState<ICookie | null>(null);
    const [newOtp, setNewOtp] = useState<string>('');
    const [otpError, setOtpError] = useState('');   // Error message for invalid OTP

    useEffect(() => {
        fetchAllCookies();
        fetchAllSession();
        fetchWhoIsTheHeader();
    }, [instructors, clientId]);
    const fetchAllSession = async () => {
        const allSession = await getAllsession();
        console.log("allSession:", allSession);
        
    }
    const fetchAllCookies = async () => {
        const cookies: ICookie[] = getAllCookies();
        console.log("all cookies:", cookies);
        const validCookiesinFetch = cookies.filter(cookie => 
            instructors.some(instructor => instructor._id === cookie.idInstractor)
        );
        setValidCookies(validCookiesinFetch);
    };

    const fetchWhoIsTheHeader = async () => {
        if (clientId) {
            const TheOpen = validCookies.find(cookie => cookie.idInstractor === clientId);
            setTheOpenSession(TheOpen);
            console.log("TheOpen:", TheOpen);
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
        console.log('Change session');
        setShowMoreTimeOptions(false);
        setShowDeleteConfirmation(false);
        setShowChangeSessionOptions(true);
        console.log('Change session', showChangeSessionOptions, validCookies);
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

    const handleSubmitChangeSession = async () => {
        if (newOtp.length === 6 && selectedSession && selectedSession.idInstractor) {
            console.log('OTP Verified:', newOtp, selectedSession);
            try{
                const ins : IInstractor | undefined = instructors.find((instructor: IInstractor) => instructor._id === selectedSession?.idInstractor);
                console.log("ins:", ins);
                const resVerify = await verifyOtpAgain(ins, newOtp);
                console.log('resVerify:', resVerify);  
                if (resVerify.res.message === "OTP verified") {
                    setAuthHeaders(selectedSession.idInstractor, newOtp);
                    setPermissions(resVerify.res.permissions);
                    console.log('OTP verified and session opened');
                    handleClose();
                }
                else{
                    console.log('OTP verified and session opened else');
                    setOtpError(resVerify.res.message);
                }
            } catch (error) {
                console.error('Error verifying OTP:', error);
                setOtpError('Invalid OTP. Please try again.');
            }
        }
        else {
            setOtpError('Please enter a valid 6-digit OTP.');
        }
    };


    return (
        <div>
            <Button variant="primary" onClick={handleShow}>Session</Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Session Details</Modal.Title>
                    <SessionModal handleCloseFather={handleClose}/>
                </Modal.Header>
                <Modal.Body>
                    {showChangeSessionOptions && (
                        <div>
                            <Dropdown onSelect={(e) => setSelectedSession(validCookies.find(cookie => cookie.idInstractor === e) || null)}>
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
                                value={newOtp}
                                onChange={(e) => setNewOtp(e.target.value)}
                                style={{ marginTop: '10px', display: 'block' }}
                            />
                            <Button variant="primary" onClick={handleSubmitChangeSession} style={{ marginTop: '10px' }}>Submit</Button>
                        </div>
                    )}
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