import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import { db } from '../config/firebase-config';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

export default function MemberTable() {
  const [members, setMembers] = useState([]);
  const [disableReason, setDisableReason] = React.useState('');
  const [selectedMember, setSelectedMember] = React.useState(null);

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

  const handleDisableAccountClick = (member) => {
    setSelectedMember(member);
    setDisableReason(''); // Clear the reason for next member
  };

  const handleDisableReasonChange = (event) => {
    setDisableReason(event.target.value);
  };

  const handleDisableConfirmClick = async () => {
    try {
        //disable in the firebase
        const admin = require('firebase-admin');
        const user = await admin.auth().getUserByEmail(selectedMember.email);
        await admin.auth().updateUser(user.uid, { disabled: true });
  
        // Update the user document in Firestore to store the reason for disabling
        const userDocRef = doc(db, 'users', selectedMember.memberId);
        await updateDoc(userDocRef, {
          disabled: true,
          disableReason: disableReason, 
      });

      console.log(`Successfully disabled a acccount for ${selectedMember.email}`);
    } catch (error) {
      console.error('Error disabling account:', error);
    }

    // Clear the selected member and reason
    setSelectedMember(null);
    setDisableReason('');
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Member Table">
          <TableHead>
            <TableRow>
              <TableCell>Member Email</TableCell>
              <TableCell>Member First Name</TableCell>
              <TableCell>Member Last Name</TableCell>
              <TableCell>Action</TableCell>
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
                <TableCell>
                  {/* Disable Account button */}
                  <Button onClick={() => handleDisableAccountClick(member)}>
                    Disable Account
                  </Button>
                </TableCell>
                <TableCell>{member.disabled? 'Disabled' : 'Authorized'}</TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Disable Account Dialog */}
      {selectedMember && (
        <div>
          <Typography variant="h6" sx={{ mb: 2, mt: 3, color: 'primary.main'}}>Disable Account: {selectedMember.email}</Typography>
          <TextField
            label="Reason"
            multiline
            rows={4}
            fullWidth
            value={disableReason}
            onChange={handleDisableReasonChange}
            sx={{ mb: 2 }}
          />
          <Button onClick={handleDisableConfirmClick}>Confirm Disable</Button>
        </div>
      )}
    </div>
  );
}
