import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { sentOtp, verifyOtp } from "../services/session-service";
import { verifyNewOtp , verifyOtpOnCookies, getAllCookies} from "../services/cookies-service";
import { useDataContext } from '../DataContext';
import { IInstractor } from "../public/interfaces";

const SessionModal: React.FC = () => {
  const { instructors } = useDataContext();
  const [show, setShow] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [otpSent, setOtpSent] = useState(false);  // Track if OTP is sent
  const [chooseInstructor, setChooseInstructor] = useState(false);  // Track if instructor is selected
  const [email, setEmail] = useState('');         // Store the email (masked)
  const [otp, setOtp] = useState<string>('');     // Store the OTP input
  const [otpError, setOtpError] = useState('');   // Error message for invalid OTP
  const [ttl, setTtl] = useState<number>(0);      // Time to live for OTP
  const [timer, setTimer] = useState<number>(0);  // Countdown timer
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    let countdown: NodeJS.Timeout;
    if (otpSent && ttl > 0) {
      setTimer(ttl);
      countdown = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            clearInterval(countdown);
            setOtpSent(false);
            setOtp('');
            setOtpError('');
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdown);
  }, [otpSent, ttl]);

  const handleClose = () => {
    setShow(false);
    setOtpSent(false);  // Reset the modal state when closed
    setOtp('');
    setOtpError('');
  };
  
  const handleShow = () => setShow(true);

  const handleSendOtp = async () => {
    console.log("OTP sent");
    setLoading(true); // Set loading to true
    try {
      const response = await sentOtp(clientId);
      console.log('OTP Response:', response);
      if (response.message === 'OTP sent via email') {
        setEmail(response.email);  // Set the email from the response
        setOtpSent(true);          // Set the OTP sent state to true
        setTtl(response.ttl);      // Set the TTL from the response
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  const handleInstructorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedInstructor(e.target.value);
    setClientId(e.target.selectedOptions[0].getAttribute('data-id') || '');
    if (e.target.value !== '') {
      setChooseInstructor(false);
    }
    else {
      setChooseInstructor(true);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) { // Only allow up to 6 digits
      setOtp(value);
    }
  };


  const handleVerifyOtpForCookie = async () => {
    if (otp.length === 6) {
      console.log('OTP Verified handleVerifyOtpForCookie:', otp);
      try {
        const ins : IInstractor | undefined = instructors.find((instructor: IInstractor) => instructor._id === clientId);
        
        const result = ins ? await verifyNewOtp(ins, "regular", otp, 1) : { res: { message: "Instructor not found" } };
        console.log('resVerify handleVerifyOtpForCookie:', result);
        if (result && 'cookie' in result && result.res.message === "OTP verified and session opened") {
          console.log('OTP verified and session opened handleVerifyOtpForCookie');
          // sessionStorage.setItem('permissions', result.cookie);
          // sessionStorage.setItem('ttl', resVerify.ttl);
          handleClose();
        } else if (result &&  'res' in result) {
          setOtpError(result.res.message);
        }
      } catch (error) {
        console.error('Error verifying OTP handleVerifyOtpForCookie:', error);
        setOtpError('Invalid OTP. Please try again.');
      }
    } else {
      setOtpError('Please enter a valid 6-digit OTP.');
    }
  };
  const handleOtpAgain = async () => {
    if (otp.length === 6) {
      console.log('OTP Verified:', otp);
      try {
        const ins : IInstractor | undefined = instructors.find((instructor: IInstractor) => instructor._id === clientId);
        
        const result = ins ? await verifyOtpOnCookies(ins, otp) : { res: { message: "Instructor not found" } };
        console.log('resVerify:', result);
        if (result  && result.res.message === "OTP verified") {
          console.log('OTP verified and session opened');
          // sessionStorage.setItem('permissions', result.cookie);
          // sessionStorage.setItem('ttl', resVerify.ttl);
          handleClose();
        } else if (result &&  'res' in result) {
          setOtpError(result.res.message);
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        setOtpError('Invalid OTP. Please try again.');
      }
    } else {
      setOtpError('Please enter a valid 6-digit OTP.');
    }
  }
  const handleVerifyOtp = async () => {
    if (otp.length === 6) {
      console.log('OTP Verified:', otp);
      try {
        const resVerify = await verifyOtp(clientId, otp);
        console.log('resVerify:', resVerify);
        if (resVerify.message === "OTP verified and session opened") {
          sessionStorage.setItem('permissions', resVerify.permissions);
          // sessionStorage.setItem('ttl', resVerify.ttl);
          handleClose();
        } else {
          setOtpError(resVerify.message);
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        setOtpError('Invalid OTP. Please try again.');
      }
    } else {
      setOtpError('Please enter a valid 6-digit OTP.');
    }
  };

  return (
    <>
      <Button className="m-1"variant="primary" size="sm" onClick={handleShow}>
        Open Session
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Open Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formInstructor">
              <Form.Label>Choose Instructor</Form.Label>
              <Form.Control 
                className='mb-2'
                as="select" 
                value={selectedInstructor} 
                onChange={handleInstructorChange}
                disabled={otpSent} // Disable if OTP is sent
              >
                <option value="">Select Instructor</option>
                {instructors.map((instructor) => (
                  <option key={instructor._id!} value={instructor.name} data-id={instructor._id!}>
                    {instructor.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {selectedInstructor && !otpSent && (
            <Button className='' variant="primary" onClick={handleSendOtp} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Sending...
                </>
              ) : (
                "Sent OTP"
              )}
            </Button>
          )}

            {otpSent && (
              <>
                <Alert variant="success">
                  OTP has been successfully sent to email: {email}
                </Alert>

                <Form.Group controlId="formOtp">
                  <Form.Label>Enter OTP</Form.Label>
                  <Form.Control
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    pattern="\d*"
                    isInvalid={otpError !== ''}
                  />
                  <Form.Control.Feedback type="invalid">
                    {otpError}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="success" onClick={handleVerifyOtp}>
                  Verify OTP
                </Button>

                <div>
                  <p>Time to expire the OTP: {timer} seconds</p>
                  {/* {otpError && <p className="text-danger">{otpError}</p>} */}

                </div>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SessionModal;