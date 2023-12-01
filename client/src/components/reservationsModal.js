import { useEffect, useState } from "react";
import { db } from "../config/firebase-config";
import { getDocs, query, collection, where } from "firebase/firestore";
import { Modal, Box, Typography } from '@mui/material';
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
                <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={reservations}
                        columns={columns}
                        pageSize={5}
                    />
                </div>
            </Box>
        </Modal>
    );


};


export default ReservationModal;