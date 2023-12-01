//this page is shown when members are logged in after authentication


import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import Card from '@mui/material/Card';
import { Alert } from '@mui/material';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { handleSignOut }  from './signOut';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import cards from './cardsData';
import CardModal from './cardModal';
import { useState } from 'react';
import { db } from '../config/firebase-config';
import { getDocs, query, where, collection } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import ReservationModal from './reservationsModal';
import { auth } from '../config/firebase-config';



function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}



// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Album() {
 
  const location = useLocation();
  const userName = location.state?.userName || 'User';

  const handleSignOutClick = async () => {
    await handleSignOut();
    window.location.href = '/'; // Redirect to the homepage
  }

  
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [reservedTimeFrames, setReservedTimeFrames] = useState([]);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);  
  const [resrvationChange, setReservationChange] = useState(false);

 React.useEffect(() => {
  if(auth.currentUser) {
    setUserId(auth.currentUser.uid);
  }
 }, []);

  const handleViewReservationClick = () => {
    setIsReservationModalOpen(true);
  }

  const showReservationSuccessAlert = () => {
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleViewClick = async (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
    //getAvailableTimeSlots(db, card.id);
    await fetchReservedTimeFrames(card.id);

  };

  const handleModalClose= () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const fetchReservedTimeFrames = async (equipmentId) => {
    const reservationRef = collection(db, 'reservations');
    const q = query(reservationRef, where('equipmentId', '==', equipmentId));
    
    try {
      const querySnapshot = await getDocs(q);
      if(!querySnapshot.empty) {
        const reservedSlots = querySnapshot.docs.map(doc => doc.data().reservationTime);
        setReservedTimeFrames(reservedSlots);
      } else {
        setReservedTimeFrames([]);
      }
    } catch (error) {
      console.error("Error fetching reservations: ", error);
      setReservedTimeFrames([]);
    }


  };

  const handleReserveClick = (selectedTimeFrame) => {
    setReservedTimeFrames([...reservedTimeFrames, selectedTimeFrame]);
  };
  

  // can remove don't need?
  /*const getAvailableTimeSlots = async (db, equipmentId) => { 
    const equipmentCollection = collection(db, 'equipment');
    const q = query(equipmentCollection, where('equipmentId', '==', equipmentId));
  
    try {
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const availableTimeSlots = doc.data().timeSlot;
          const name = doc.data().name;
          
        });
      } else {
        console.log('No documents found with the specified equipmentId');
      }
    } catch (error) {
      console.error('Error fetching documents:', error.message);
    }
  };
*/


  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <FitnessCenterIcon sx={{ mr: 2 }} />
          <Typography variant="h6" color="inherit" noWrap>
            CPP Lifting Club
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              Equipment Menu
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Welcome, {userName}
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button onClick={handleViewReservationClick} variant="contained">View My Reservations</Button>
              <Button onClick={handleSignOutClick} variant="outlined">Sign Out</Button>
            </Stack>
          </Container>

          {userId && (
            <ReservationModal
              open={isReservationModalOpen}
              onClose={() => setIsReservationModalOpen(false)}
              userId={userId}
            />
          )}



        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      // 16:9
                      pt: '0%',
                    }}
                    image={card.imageUrl}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.heading}
                    </Typography>
                    <Typography>
                      {card.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleViewClick(card)}>
                      View
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography variant="h6" align="center" gutterBottom>
          Footer
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Something here to give the footer a purpose!
        </Typography>
        <Copyright />
      </Box>
      {/* End footer */}

      {showSuccessAlert && ( 
        <Box position="fixed" top={'50%'} left={'45%'} >
        <Alert severity="success">Reservation successful </Alert>
        </Box>
      )}

      

      {selectedCard && (
        <CardModal
        open={isModalOpen}
        onClose={handleModalClose}
        card={selectedCard}
        onReserveClick={handleReserveClick}
        reservedTimeFrames={reservedTimeFrames}
        onReservationSuccess={showReservationSuccessAlert}
        reservationChage={reservationChange}
        setReservationChange={setReservationChange}
       
      />
      )}


    </ThemeProvider>
  );
}