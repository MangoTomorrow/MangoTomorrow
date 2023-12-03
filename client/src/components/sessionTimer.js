

import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase-config";
import { signOut } from "firebase/auth";



const SESSION_TIMEOUT = 15* 60 * 1000;
let sessionTimer;
const navigate = useNavigate();

export const startSessionTime = () => {
    clearTimeout(sessionTimer);
    sessionTimer = setTimeout(() => {
        signOut(auth).then(() => {
            //insert alert to let user know they are being logged out
            navigate('/');
        });
    }, SESSION_TIMEOUT);
};


export const resetSessionTimer = () => {
    startSessionTime();
};