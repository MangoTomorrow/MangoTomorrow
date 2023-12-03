
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";

const SESSION_TIMEOUT = 15 * 60 * 1000; //15 minutes

export const useSessionTimeout = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    let sessionTimer = setTimeout(() => {
      signOut(auth).then(() => {
        console.log("User signed out after 15 minutes of inactivity");
        navigate('/');
      });
    }, SESSION_TIMEOUT);

    const resetTimer = () => {
      clearTimeout(sessionTimer);
      sessionTimer = setTimeout(() => {
        signOut(auth).then(() => {
          console.log("User signed out after 15 minutes of inactivity");
          navigate('/');
        });
      }, SESSION_TIMEOUT);
    };

   
    window.addEventListener("click", resetTimer);
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

 
    return () => {
      clearTimeout(sessionTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [navigate, auth]);
};
