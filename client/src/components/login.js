//main login/home page

import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import handleLogin from './loginLogic';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './authContext';
import { Alert } from '@mui/material';
import { useState } from 'react';
import projectLogo from '../logo/projectLogo.jpg';



// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignInSide() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setUserRole } = useAuth();
  
  const onLoginSuccess = (role, userName) => {
    if(role === 'admin') {
      navigate('/adminDashboard');
    } else if (role === 'member') {
        navigate('/memberDashboard', { state: { userName } });
    }
  };

  const [loginError, setLoginError] = useState(false);

  const onLoginFailure = (error) => {
    console.error('login fail', error);
    setLoginError(true);
    setTimeout(() => setLoginError(false), 3000);
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get('email');
    const password = data.get('password');
    handleLogin(email, password, onLoginSuccess, onLoginFailure, setIsAuthenticated, setUserRole ); //handle login
    
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: '/Users/anthonyshen/Documents/GitHub/MangoTomorrow/photos/Bronco Lifting logo 1 inverse.jpg',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}do
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            
              <img src={projectLogo} alt="Project Logo" style={{ height: '30%', width: '30%' }}/>
            
            
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              
              {loginError && (
                <Alert
                  severity='error'
                  sx={{
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0,
                  }}
                  onClose={() => setLoginError(false)}
                  
                >
                  Please check your email or password again.
                </Alert>
              )};

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                
                <Grid item>
                  <Link href="/signUp" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}