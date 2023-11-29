
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Splitbutton from './splitButton';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../config/firebase-config';
import { useState } from 'react'
import { Alert } from '@mui/material';
import { fetchUserName } from './loginLogic';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CardModal = ({ open, onClose, card, onReserveClick, reservedTimeFrames, onReservationSuccess }) => {

    const [selectedTimeFrame, setSelectedTimeFrame] = useState(null);
    const [showErrorAlert, setShowErrorAlert] = useState(false);

const handleTimeFrameSelect = (timeFrame) => {
    setSelectedTimeFrame(timeFrame);
}



const handleReserveClick = async () => {

        if(!selectedTimeFrame) {
            setShowErrorAlert(true);
            setTimeout(()=> setShowErrorAlert(false), 3000);
            return;
        }
        try{
            const user = auth.currentUser;
            if(user) {
                const userName = await fetchUserName(user.uid);
                await addDoc(collection(db, 'reservations'), {
                    equipmentId: card.id,
                    equipmentName: card.name,
                    reservationTime: selectedTimeFrame,
                    userId: user.uid,
                    userName: userName || "unknown user",
                    userEmail: user.email
                });
                onReserveClick(selectedTimeFrame);
                onReservationSuccess();
                onClose();
            } else {
                console.error("user not logged in");
            }
        

        } catch(error) {
            console.error("Error adding reservations: ", error);
        }
        
};






    return (
        <Modal
        
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
            <Box sx={style}>

            
            
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    {card.heading}
                </Typography>
                <Typography id="modal-modal-description" sx={{mt: 2, mb: 5}}>
                    {card.description}
                    <br/>
                </Typography>
                
                
                <Box
                
                sx={{
                    position: 'flex',
                    top: '0%',
                    right: 0,
                    
                    p: 0,
                }}
                >
                <Button onClick={handleReserveClick} variant="contained" sx={{ mr: 4, height: 35 }}>
                    Reserve
                </Button>
                {showErrorAlert && ( 
                    <Box position="fixed" top={'10%'} left={'45%'} >
                    <Alert severity="error">Select a Time Frame! </Alert>
                    </Box>
                )}

                <Splitbutton  onSelectTimeFrame={handleTimeFrameSelect} reservedTimeFrames={reservedTimeFrames}/>
                
                </Box>
                
            </Box>


        </Modal>
            
        


    );
};

export default CardModal;