
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
import { collection, query, where, updateDoc, doc, onSnapshot } from 'firebase/firestore';

export default function MemberTable() {
  const [members, setMembers] = useState([]);
  const [disableReason, setDisableReason] = React.useState('');
  const [selectedMember, setSelectedMember] = React.useState(null);

  //real time monitoring of state <disable/enable>
  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'member'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const membersData = snapshot.docs.map(doc => ({
        memberId: doc.id,
        ...doc.data(),
      }));
      console.log('membersdata: ', membersData);
      setMembers(membersData);
    }, (error)=> {
      console.error('error fetching real-time: ', error);
    });
    return () => unsubscribe();
  }, []);

  const handleDisableAccountClick = (member) => {
    setSelectedMember(member);
    setDisableReason(''); // Clear the reason for the next member
  };

  const handleDisableReasonChange = (event) => {
    setDisableReason(event.target.value);
  };

  const handleDisableConfirmClick = async () => {
    try {
      // Update the user document in Firestore to disable the account
      const userDocRef = doc(db, 'users', selectedMember.memberId);
      await updateDoc(userDocRef, {
        disabled: true, // User login will be invalid
        disableReason: disableReason, // Store the reason for disabling
      });

      // Disable the user account using Firebase Admin SDK
      await disableUserAccount(selectedMember.memberId);
      

      
    } catch (error) {
      console.error('Error disabling account:', error);
    }

    // Clear the selected member and reason
    setSelectedMember(null);
    setDisableReason('');
  };

  const handleEnableAccountClick = async (userId) => {

    try{
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        disabled: false,
    });
    
      const response = await fetch('/enableUserAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({userId}),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('error enabling user account: ', error);
    }
  };

  // Function to disable a user account using the server endpoint
  const disableUserAccount = async (userId) => {

    console.log('this is uid from disable api call: ', userId);
    try {
      const response = await fetch('/disableUserAccount', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      console.log(data); // Log the response from the server
    } catch (error) {
      console.error('Error disabling user account:', error);
    }
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
              <TableCell>Account Status</TableCell>
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
                 {member.disabled ? (
                  <Button onClick={() => handleEnableAccountClick(member.memberId)}>
                    Enable Account
                  </Button> 
                 ):(
                  <Button onClick={() => handleDisableAccountClick(member.memberId)}>
                    Disable Account
                  </Button>
                 )}
                </TableCell>
                <TableCell>{member.disabled ? 'Disabled' : 'Authorized'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Disable Account Dialog */}
      {selectedMember && (
        <div>
          <Typography variant="h6" sx={{ mb: 2, mt: 3, color: 'primary.main' }}>
            Disable Account: {selectedMember.email}
          </Typography>
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

