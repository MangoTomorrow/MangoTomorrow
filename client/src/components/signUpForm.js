
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import signUp from './signUpLogic';
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { Alert } from '@mui/material';
import projectLogo from '../logo/projectLogo.jpg';



// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();



export default function SignUpForm() {

  //check email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    allowExtraEmails: false,
  });

  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password, firstName, lastName } = formData;
    
    //if incorrect email format, console log. 
    if (!isValidEmail(email)) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    try {
      //call the Firebase authentication function for user registration
      await signUp(email, password);


      //temp store user data 
      localStorage.setItem('pendingUserData', JSON.stringify({
        firstName,
        lastName,
        email,
      }))

    

      //clear the form fields
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        allowExtraEmails: false,
      });
      //direct user back to login page
      navigate('/verify', { state: { email: email } });
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };




  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src={projectLogo}  alt='Project Logo' style={{ height: '250px', width: '300px' }} />
          <Typography component="h1" variant="h5" sx={{ mt: 3}}>
            Register for CPP Lifting Club
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formData.firstName} 
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </Grid>
              <Box sx={{ ml: 8 }}>
              {showAlert && (
            <Alert severity='error'> Please enter a valid email address. </Alert>
              )}
              </Box>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </Grid>
              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2, color: 'black', borderColor: 'black' }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2" sx={{ color: 'black' }}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
          
        </Box>
        
      </Container>
    </ThemeProvider>
  );
}

