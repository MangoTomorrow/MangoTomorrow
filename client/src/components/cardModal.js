
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Splitbutton from './splitButton';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../config/firebase-config';
import { useState } from 'react'
import { Alert } from '@mui/material';


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
            await addDoc(collection(db, 'reservations'), {
                equipmentId: card.id,
                equipmentName: card.name,
                reservationTime: selectedTimeFrame
            });
            onReserveClick(selectedTimeFrame);
            onReservationSuccess();
            onClose();
        

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
                <Typography id="modal-modal-description" sx={{mt: 2}}>
                    {card.description}
                </Typography>
                <Button onClick={handleReserveClick} variant="contained" sx={{ mt: 2 }}>
                    Reserve
                </Button>
                
                <Box
                
                sx={{
                    position: 'absolute',
                    top: '55%',
                    right: 0,
                    
                    p: 2,
                }}
                >

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