

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase-config';

export const useAuthNavigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if(user) {
        const idTokenResult = await user.getIdTokenResult();
        if(idTokenResult.claims.admin) {
          navigate('/adminDashboard');
        } else {
          navigate('/memberDashboard');
        }
      } else {
        navigate('/');
      }
    });
    return () => {
      unsubscribe();
    };
  }, [navigate]);
};
