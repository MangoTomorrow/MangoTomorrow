import { useEffect, useState } from "react";
import { db } from "../config/firebase-config";
import { doc, getDocs, query, collection, where, deleteDoc } from "firebase/firestore";
import { Modal, Box, Typography, Button, Alert } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";




const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };




const ReservationModal = ({ open, onClose, userId }) => {
    const [reservations, setReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('success');
    const [alertMessage, setAlertMessage] = useState('');


    const handleCancelReservation = async (reservationId) => {
        if(!reservationId) return;
    
        try{
            await deleteDoc(doc(db, 'reservations', reservationId));
            setReservations(reservations.filter(res => res.id !== reservationId));
            setSelectedReservation(null);
            setAlertMessage('Reservation Cancelled');
            setAlertType('success');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
            
    
        } catch (error) {
            console.error("Error canceling reservation: ", error);
            setAlertMessage('Failed to cancel reservation.');
            setAlertType('error');
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    const handleSelectionChange = (newSelection) => {
        setSelectedReservation(newSelection.rowIds[0]);
    };



    useEffect(() => {
        const fetchReservations = async () => {
            if(!userId) return;

            const q = query(collection(db, 'reservations'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            const userReservations = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data()}));

            setReservations(userReservations);
        };

        fetchReservations();
    }, [userId]);

    const columns = [
        { field: 'equipmentId', headerName: 'Equipment ID', width: 150},
        { field: 'equipmentName', headerName: 'Equipment Name', width: 200},
        { field: 'reservationTime', headerName: 'Reserved Time', width: 200},

    ];

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >

            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    My Reservations
                </Typography>
                {showAlert && (
                    <Alert severity={alertType}>{alertMessage}</Alert>
                )}
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={reservations}
                        columns={columns}
                        pageSize={5}
                        checkboxSelection
                        onRowSelectionModelChange={handleSelectionChange}
                    />
                </div>
            </Box>

            <Button
                variant="contained"
                color="secondary"
                onClick={() => handleCancelReservation(selectedReservation)}
                disabled={!selectedReservation}
            >
                Cancel Reservation
            </Button>

        </Modal>
    );


};


export default ReservationModal;