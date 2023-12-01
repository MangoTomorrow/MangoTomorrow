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
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function MemberTable() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'users'), where('role', '==', 'member'));
        const membersSnapshot = await getDocs(q);
        const membersData = membersSnapshot.docs.map((doc) => ({
          memberId: doc.id,
          ...doc.data(),
        }));
        setMembers(membersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="Member Table">
        <TableHead>
          <TableRow>
            <TableCell>Member Email</TableCell>
            <TableCell>Member First Name</TableCell>
            <TableCell>Member Last Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member) => (
            <TableRow
              key={member.memberId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.firstName}</TableCell>
              <TableCell>{member.lastName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
