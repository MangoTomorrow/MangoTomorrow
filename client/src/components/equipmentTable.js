

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { db } from '../config/firebase-config';
import { collection, getDocs } from 'firebase/firestore';


export default function EquipmentTable() {

    const [combinedData, setCombinedData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const equipmentSnapshot = await getDocs(collection(db, "equipment"));
            const reservationSnapshot = await getDocs(collection(db, "reservations"));

            const equipmentData = equipmentSnapshot.docs.map(doc => ({ equipmentId: doc.id, ...doc.data() }));
            const reservationData = reservationSnapshot.docs.map(doc => ({ ...doc.data() }));

            const combined = equipmentData.map(equipment => {
                const reservations = reservationData.filter(reservation => reservation.equipmentId === equipment.equipmentId);
                return { ...equipment, reservations };
            });
            console.log(reservationData);
            setCombinedData(combined);
        };

        fetchData();
    }, []);



    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Equipment Status Table">
          <TableHead>
            <TableRow>
              <TableCell>Equipment ID</TableCell>
              <TableCell>Equipment Name</TableCell>
              <TableCell align="right">Reservation Times</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {combinedData.map((equipment) => (
            <TableRow 
                key = {equipment.equipmentId}
                sx={{ '&:last-child td, &:last-child th': { border: 0} }}
            >
                <TableCell>{equipment.equipmentId}</TableCell>
                <TableCell>{equipment.name}</TableCell>
                <TableCell align="right">
                    {equipment.reservations.map((reservation, index) => (
                        <div key={index}>
                            {reservation.reservationTime} -
                            Reserved by: {reservation.userName} ({reservation.userEmail})
                            </div>
                    ))}
                </TableCell>
                </TableRow>
            ))}
            
          </TableBody>
        </Table>
      </TableContainer>
    );
  }