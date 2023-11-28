

import React, {useEffect} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../config/firebase-config';
import { Alert } from '@mui/material';


const EmailVerification = () => {

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const actionCode = urlParams.get('oobCode');

        if(actionCode){
            auth.applyActionCode(actionCode).then(() => {
                const userData = JSON.parse(localStorage.getItem('pendingUserData'));
                if(userData){
                    db.collection("users").doc(userData.uid).set(userData).then(() => {
                        localStorage.removeItem('pendingUserData');
                        navigate('/');
                    }).catch(error => {
                        console.error('error adding user data to firestore: ', error);
                    });
                }
            }).catch(error => {
                console.error('error verifying email: ', error);
            });
        }
    }, [location, navigate]);

    return (
        <Alert severity='info'>Verifying your email...</Alert>
    );
};

export default EmailVerification;