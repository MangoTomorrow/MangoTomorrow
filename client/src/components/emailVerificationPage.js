
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { auth } from '../config/firebase-config';
import { sendEmailVerification } from 'firebase/auth';






export default function EmailVerificationPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const userEmail = location.state?.email;

    React.useEffect(() => {
       const timer = setTimeout(() => {
        navigate('/');
       }, 60000);

       return () => clearTimeout(timer);
    }, [navigate] );

    const handleGoHome = () => {
        navigate('/');
    };

    const resendEmail = async () => {
        const user = auth.currentUser;
        if(user) {
            try{
                await sendEmailVerification(user);
            } catch (error) {
                console.error('error sending email verification: ', error);
            }
        }
    };





    return (
    <Card sx={{ minWidth: 100, maxWidth: 600, mt: '10%', alignSelf: 'center', height: 400, ml: '35%', borderRadius: 10, backgroundColor: '#90caf9' }}>
      <CardContent>
        <Typography sx={{ fontSize: 50, }} color="white" gutterBottom>
          CPP Lifting Club 
        </Typography>
        <Typography variant="h5" component="div">
          
        </Typography>
        <Typography sx={{ mb: 1.5, fontSize: 30 }} color="text.secondary">
          Please verify your email. 
          <br/>
          Verification email was sent to:
          <br/>
        </Typography>

        <Typography sx={{ fontSize: 25 }}>
           <strong> {userEmail} </strong>

        </Typography>
        <Box sx={{ display: 'flex', mt: 2, ml: '30%'}}>
        <Typography>
            <br/>
            Redirecting in 60 seconds...
        </Typography>
        
        <CountdownCircleTimer
            isPlaying
            duration={60}
            colors={['#c8e6c9', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[60, 40, 20, 10]}
            strokeWidth={5}
            size={50}
        >
              {({ remainingTime }) => remainingTime}
        </CountdownCircleTimer>
        </Box>

        
        
        <Box sx={{ display: 'flex', }}>
        
        <Button onClick={handleGoHome} variant='contained' sx={{mt: 2, ml: 7}}>
            Go to Login Page
        </Button>
        <Button onClick={resendEmail} variant='contained' sx={{ maxHeight: 35, mt:2, ml: 5}}>
            Resend Verification Email
        </Button>

        </Box>
      </CardContent>
     
    </Card>
    );
}
