import React, { useState, useEffect } from 'react';
import { IInstractor } from "../public/interfaces";
import { useDataContext } from '../DataContext';
import { ProgressBar, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import useSessionStorage from '../hooks/useSessionStorage';
import { getMyTtlSession, RegularDeleteSession } from "../services/session-service";

const CurrentSession: React.FC = () => {
    const { instructors } = useDataContext();
    const clientId = useSessionStorage('client-id');
    const otp = useSessionStorage('otp');
    const permissions = useSessionStorage('permissions');
    const [instructor, setInstructor] = useState<string>('');
    const [show, setShow] = useState(false);
    const [ttl, setTtl] = useState<number>(0);
    const [clickCount, setClickCount] = useState(0);

    useEffect(() => {
        const fetchTtlAndUpdate = async () => {
            if (clientId && otp && sessionStorage.getItem('client-id') === clientId) {
                const currentInstructor: IInstractor | undefined = instructors.find((instructor: IInstractor) => instructor._id === clientId);
                const response = await getMyTtlSession();
                const newttl = response.ttl;

                if (typeof newttl === 'number' && newttl >= 0) {
                    setTtl(newttl);
                } else {
                    setTtl(0);
                }
                if (currentInstructor && newttl !== 0) {
                    setInstructor(currentInstructor.name);
                    setShow(true);
                }
            } else {
                setShow(false);
            }
        };

        fetchTtlAndUpdate();
    }, [clientId, otp, instructors]);

    useEffect(() => {
        let countdown: NodeJS.Timeout;
        if (show && ttl > 0) {
            countdown = setInterval(() => {
                setTtl(prevTtl => {
                    if (prevTtl <= 1) {
                        clearInterval(countdown);
                        sessionStorage.removeItem('client-id');
                        sessionStorage.removeItem('otp');
                        sessionStorage.removeItem('ttl');
                        setShow(false);
                        return 0;
                    }
                    return prevTtl - 1;
                });
            }, 1000);
        }
        return () => clearInterval(countdown);
    }, [show, ttl]);

    const handleClose = () => {
        RegularDeleteSession();
        setShow(false);
    };

    const handleDoubleClick = () => {
        setClickCount(prevCount => prevCount + 1);
        if (clickCount === 1) {
            handleClose();
        } else {
            setTimeout(() => setClickCount(0), 300); // Reset click count after 300ms
        }
    };

    const ttlInMinutes = Math.floor(ttl / 60);
    const remainingSeconds = ttl % 60;
    const isTtlUnderOneMinute = ttl < 60;
    const ttlPercentage = (ttl / 600) * 100; // Assuming TTL max is 10 minutes (600 seconds)

    return (
        <div>
            {show && (
                <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    overlay={
                        <div className="p-2 m-4 border rounded bg-white shadow-sm" style={{ width: '14rem', zIndex: 999 }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <span>{instructor ? `Instructor: ${instructor}` : 'Session Active'}</span>
                                <Button
                                    size="sm"
                                    variant={clickCount === 0 ? "outline-danger" : "danger"}
                                    style={clickCount === 0 ? { backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 0, 0, 0.5) 10px, rgba(255, 0, 0, 0.5) 20px)' } : {}}
                                    onClick={handleDoubleClick}
                                >
                                   x
                                </Button>
                            </div>
                            <span>{permissions ?  `permissions: ${permissions}` : 'no permssions'}</span>
                            <ProgressBar
                                now={ttlPercentage}
                                variant={isTtlUnderOneMinute ? 'danger' : 'info'}
                                className="my-2"
                                style={{ height: '8px' }}
                            />
                            <div className="text-center small">
                                TTL: {ttlInMinutes}m {remainingSeconds}s
                            </div>
                        </div>
                    }
                >
                    <Button size="sm" variant="primary">
                        Your Session
                    </Button>
                </OverlayTrigger>
            )}
        </div>
    );
};

export default CurrentSession;