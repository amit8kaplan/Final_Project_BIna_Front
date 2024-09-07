import { useState, useEffect } from 'react';

const useSessionStorage = (key: string) => {
    const [value, setValue] = useState<string | null>(sessionStorage.getItem(key));

    useEffect(() => {
        const handleStorageChange = () => {
            const newValue = sessionStorage.getItem(key);
            setValue(newValue);

            // Automatically remove session storage if TTL reaches 0 for 'client-id'
            if (key === 'client-id' && newValue === '0') {
                sessionStorage.removeItem('client-id');
                sessionStorage.removeItem('otp');
                sessionStorage.removeItem('ttl');
                sessionStorage.removeItem('permissions');
                sessionStorage.removeItem('instructor');
            }
        };

        const originalSetItem = sessionStorage.setItem;
        sessionStorage.setItem = function (k, v) {
            originalSetItem.apply(this, arguments);
            if (k === key) {
                handleStorageChange();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            sessionStorage.setItem = originalSetItem;
        };
    }, [key]);

    return value;
};

export default useSessionStorage;
