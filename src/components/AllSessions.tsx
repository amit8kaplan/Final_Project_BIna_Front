import React, { useState, useEffect, useRef } from 'react';
import { ICookie, IInstractor } from "../public/interfaces";
import { useDataContext } from '../DataContext';
import { Button, Modal, Dropdown, Form, Row, Col } from 'react-bootstrap';
import useSessionStorage from '../hooks/useSessionStorage';
import { getAllCookies, addMoreTimeToCookie, deleteTheCookies } from "../services/cookies-service";
import { verifyOtpAgain } from "../services/session-service";
import { setAuthHeaders, setPermissions } from '../public/data';
import SessionModal from './SessionModal';
import { set } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons';

import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const AllSessions: React.FC = () => {
    const { instructors } = useDataContext();
    const [cookies, setCookies] = useState<ICookie[]>(getAllCookies());
    const [clientID, setClientID] = useState<string>('');
    const [permissions, setPermissions] = useState<string>('');
    const [otp, setOtp] = useState<string>('');
    const [otpSent, setOtpSent] = useState(false);  // Track if OTP is sent
    const [showModal, setShowModal] = useState(false);
    const [validCookies, setValidCookies] = useState<ICookie[]>([]);
    const [theOpenSession, setTheOpenSession] = useState<ICookie | null>(null);
    const [showMoreTimeOptions, setShowMoreTimeOptions] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [showChangeSessionOptions, setShowChangeSessionOptions] = useState(false);
    const [selectedTime, setSelectedTime] = useState<number>(0);
    const [selectedSession, setSelectedSession] = useState<ICookie | null>(null);
    const [newOtp, setNewOtp] = useState<string>('');
    const [otpError, setOtpError] = useState<string>(''); 
    const [sessionChanged, setSessionChanged] = useState(false); // New state to track session changes
    const [sessionDeletedChanged, setSessionDeletedChanged] = useState(false); // New state to track session changes
    const [addTime, setAddTime] = useState(false); // New state to track session changes
    const [ttl, setTtl] = useState<number>(0);
    const [remainingTime, setRemainingTime] = useState<number>(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        fetchAllCookies();
        fetchWhoIsTheHeader();
        setOtpSent(false);
        setSelectedTime(0);
    }, [addTime, instructors, clientID,permissions, sessionChanged, sessionDeletedChanged, otpError]); // Add sessionChanged to the dependency array

    const fetchAllCookies = async () => {
        const cookiesFetch = getAllCookies();
        const validCookies = cookiesFetch.filter(cookie => 
            instructors.some(instructor => instructor._id === cookie.idInstractor)
        );
        setCookies(cookiesFetch); // Update the cookies state
        setValidCookies(validCookies);
    };

    const fetchWhoIsTheHeader = async () => {
        const clientIDfetch = sessionStorage.getItem('client-id');
        const permissionsfetch = sessionStorage.getItem('permissions');
        const otpfetch = sessionStorage.getItem('otp');
        setClientID(clientIDfetch || '');
        setPermissions(permissionsfetch || '');
        //console.log('setPermissions in fetchWhoIsTheHeader :', permissionsfetch, permissions);
        setOtp(otpfetch || '');
        if (clientID) {
            const openSession = validCookies.find(cookie => cookie.idInstractor === clientID);
            setTheOpenSession(openSession || null);
        } else {
            setTheOpenSession(null);
        }
    };

    useEffect(() => {
        if (theOpenSession) {
            const sessionTTL = parseInt(theOpenSession.ttl, 10);
            setTtl(sessionTTL);
            if (remainingTime === 0) {
                setRemainingTime(sessionTTL); // Set remaining time when the session is opened
            }
            startTimer(sessionTTL); // Start the timer if no remaining time is saved
        }
    }, [theOpenSession]);

    const startTimer = (initialTtl: number) => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setRemainingTime(prevTtl => {
                if (prevTtl <= 0) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return prevTtl - 1;
            });
        }, 1000);
    };

    const handleShow = () => {
        setShowModal(true);
        setSelectedSession(null); // Reset selected session
        setNewOtp(''); // Reset OTP input
        setOtpError(''); // Reset OTP error
        if (remainingTime > 0 && theOpenSession != null) {
            startTimer(remainingTime); // Continue the timer from the remaining time when the modal is reopened
        }
    };

    const handleClose = () => {
        setOtpError('');
        setNewOtp('');
        setShowModal(false);
        setOtpSent(false);  // Reset the modal state when closed
        setShowMoreTimeOptions(false);
        setShowDeleteConfirmation(false);
        setShowChangeSessionOptions(false);
        if (timerRef.current) {
            clearInterval(timerRef.current); // Keep track of remaining time when closing modal
        }
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

    const handleSubmitMoreTime = async () => {
        if (theOpenSession && theOpenSession.name && theOpenSession.idInstractor && otp && selectedTime > 0) {
            await addMoreTimeToCookie(theOpenSession.name, theOpenSession.idInstractor, otp, selectedTime);
            // Fetch the cookies again to refresh the state
            await fetchAllCookies();
            setAddTime(!addTime);
            handleClose();

            // Update the TTL of the open session
            let tempOpenSession = { ...theOpenSession };
            tempOpenSession.ttl = (parseInt(tempOpenSession.ttl, 10) + (selectedTime * 3600)).toString();
            setTheOpenSession(tempOpenSession);
            setTtl(parseInt(tempOpenSession.ttl, 10)); // Update the TTL state
            setRemainingTime(parseInt(tempOpenSession.ttl, 10)); // Restart the remaining time with the updated TTL
            startTimer(parseInt(tempOpenSession.ttl, 10));

        }
    };

    const handleConfirmDelete = async () => {
        if (theOpenSession && theOpenSession.idInstractor && otp) {
            await deleteTheCookies(theOpenSession.idInstractor, otp);
            setSessionDeletedChanged(!sessionDeletedChanged);
            handleClose();
            setTheOpenSession(null);
        }
    };

    const handleSubmitChangeSession = async () => {
        if (newOtp.length === 6 && selectedSession && selectedSession.idInstractor) {
            const instructor = instructors.find(instructor => instructor._id === selectedSession.idInstractor);
            if (instructor) {
                setOtpSent(true);
                const resVerify = await verifyOtpAgain(instructor, newOtp);
                if (resVerify.res && resVerify.res.message === "OTP verified") {
                    setAuthHeaders(selectedSession.idInstractor, newOtp);
                    setPermissions(resVerify.res.permissions);
                    setTheOpenSession(selectedSession); // Update the open session to the selected session
                    setTtl(parseInt(selectedSession.ttl, 10)); // Update the TTL state
                    setRemainingTime(parseInt(selectedSession.ttl, 10)); // Update the remaining time
                    startTimer(parseInt(selectedSession.ttl, 10)); // Start the timer for the new session
                    handleClose();
                } else if (resVerify.message) {
                    setOtpError(resVerify.message);
                } else {
                    setOtpError('An unknown error occurred.');
                }
            }
        } else {
            setOtpError('Please enter a valid 6-digit OTP.');
        }
    };

    const handleInstructorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const instructorId = e.target.value;
        const theCookie = validCookies.find(cookie => cookie.idInstractor === instructorId) || null;
        setSelectedSession(theCookie);
    };

    return (
        <div>
            <Button variant="" onClick={handleShow}>Session</Button>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Session Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showChangeSessionOptions ? (
                        <div>
                            <Form>
                                <Form.Group controlId="formInstructor">
                                    <Form.Label>Select Instructor & session</Form.Label>
                                    <Form.Control
                                        className='mb-2'
                                        as="select"
                                        value={selectedSession ? selectedSession.idInstractor : ''}
                                        onChange={handleInstructorChange}
                                        disabled={otpSent} // Disable if OTP is sent
                                    >
                                        <option value="">Select Instructor</option>
                                        {validCookies.map((cookie) => (
                                            <option key={cookie.idInstractor} value={cookie.idInstractor}>{cookie.name}</option>
                                        ))}
                                    </Form.Control>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={newOtp}
                                        maxLength={6}
                                        pattern="\d*"
                                        onChange={(e) => setNewOtp(e.target.value)}
                                        style={{ marginTop: '10px' }}
                                        isInvalid={otpError !== ''}
                                    />
                                    {otpError && <p style={{ color: 'red' }}>{otpError}</p>}
                                    <Button variant="primary" onClick={handleSubmitChangeSession} style={{ marginTop: '10px' }}>Submit</Button>
                                </Form.Group>
                            </Form> 
                        </div>
                    ) : theOpenSession ? (
                        <div>
                            
                            <h5>{theOpenSession.name}</h5>
                            <h5>{(remainingTime / 3600).toFixed(2)} Hours</h5>
                            {/* {permissions && permissions!= "undefined" && permissions!= null && <h5>{permissions} permission</h5>} */}
                            <h5>{permissions} permission</h5>
                            {!showMoreTimeOptions && !showDeleteConfirmation && (
                                <div>
                                    {/* <Button variant="secondary" onClick={handleGetMoreTime}>Get More Time</Button> */}
                                    <FontAwesomeIcon 
                                        icon={faHourglassHalf} 
                                        onClick={handleGetMoreTime}
                                        style={{ 
                                            backgroundColor: 'green', 
                                            color: 'white', 
                                            padding: '5px', 
                                            borderRadius: '5px' ,
                                            cursor: 'pointer'
                                        }} 
                                    />
                                    <FontAwesomeIcon 
                                        icon={faTrash} 
                                        onClick={handleDeleteSession} 
                                        style={{ 
                                            marginLeft: '10px', 
                                            cursor: 'pointer', 
                                            backgroundColor: 'red', 
                                            color: 'white', 
                                            padding: '5px', 
                                            borderRadius: '5px' 
                                        }}
                                    /> 
                                    {/* <Button variant="danger" onClick={handleDeleteSession} style={{ marginLeft: '10px' }}>Delete Session</Button> */}
                                </div>
                            )}
                            {showMoreTimeOptions && (
                                <div>
                                    <Form>
                                        <Form.Group controlId="formSelectTime">
                                            <Form.Control
                                                as="select"
                                                value={selectedTime}
                                                onChange={(e) => setSelectedTime(Number(e.target.value))}
                                                isInvalid={otpError !== ''}
                                            >
                                                <option value="">Select Time</option>
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((time) => (
                                                    <option key={time} value={time}>
                                                        {time} Hour{time > 1 ? 's' : ''}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            <Button variant="primary" onClick={handleSubmitMoreTime} style={{ marginTop: '10px' }}>
                                                Submit
                                            </Button>
                                        </Form.Group>
                                    </Form>
                                </div>
                            )}
                            {showDeleteConfirmation && (
                                <div>
                                    <p>Are you sure you want to delete this session?</p>
                                    <Button variant="danger" onClick={handleConfirmDelete}>Yes, Delete</Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>No session selected.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="warning" onClick={handleChangeSession}>Switch Session</Button>
                    <SessionModal handleCloseFather={handleClose} onSessionChange={() => setSessionChanged(!sessionChanged)} />
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AllSessions;