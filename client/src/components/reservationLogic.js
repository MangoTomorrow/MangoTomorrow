
import { firestore } from "../config/firebase-config.js";


const ReservationLogic = () => {

    const recordReservation = async (userId, equipmentName, timeSlot) => {
        try {
            const reservationCollection = firestore.collection('reservations');

            await reservationCollection.add({
                userId,
                equipmentName,
                timeSlot
            });


        }catch(error) {

        }
    } 
} 