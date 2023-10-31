//this page is to be shown to admin when they click on members tab on nav bar
//give other functionalities to admin here 

import React, { useEffect, useState } from 'react';
import { auth, db } from '../config/firebase-config';

const AdminMembersPage = () => {
  const [members, setMembers] = useState([]);
  
  useEffect(() => {
    // Fetch a list of members from Firebase when the component mounts
    const fetchMembers = async () => {
      try {
        const membersCollection = await db.collection('members').get();
        const memberData = membersCollection.docs.map((doc) => doc.data());
        setMembers(memberData);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };

    fetchMembers();
  }, []);

  const deleteMember = async (memberId) => {
    // Implement member deletion logic here
    try {
      await db.collection('members').doc(memberId).delete();
      // After successful deletion, update the members list
      setMembers((prevMembers) => prevMembers.filter((member) => member.id !== memberId));
    } catch (error) {
      console.error('Error deleting member:', error);
    }
  };

  return (
    <div>
      <h2>Admin Members Page</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id}>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>
                <button onClick={() => deleteMember(member.id)}>Delete</button>
                {/* Add more actions here, e.g., view member details */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMembersPage;
