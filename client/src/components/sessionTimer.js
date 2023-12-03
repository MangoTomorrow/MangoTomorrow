import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";

const SESSION_TIMEOUT = 15 * 60 * 1000; // 15 minutes

export const useSessionTimeout = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // Define the timer within the useEffect scope
    let sessionTimer = setTimeout(() => {
      signOut(auth).then(() => {
        console.log("User signed out after 15 minutes of inactivity");
        navigate('/');
      });
    }, SESSION_TIMEOUT);

    // Function to reset the timer
    const resetTimer = () => {
      clearTimeout(sessionTimer);
      sessionTimer = setTimeout(() => {
        signOut(auth).then(() => {
          console.log("User signed out after 15 minutes of inactivity");
          navigate('/');
        });
      }, SESSION_TIMEOUT);
    };

    // Set up event listeners for user interaction
    window.addEventListener("click", resetTimer);
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    // Cleanup function
    return () => {
      clearTimeout(sessionTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
    };
  }, [navigate, auth]);
};
