


const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('/home/ec2-user/cppLiftingClub/cppLiftingClubKey.json');



app.use(express.json());
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.post('/setAdminRole', (req, res) => {

  const email = req.body.email;
  const customClaims = { admin: true };
  console.log('Received email in server.js :', email); 

  if(isInitialAdmin(email)) {
    console.log('Email is recognized as an initial admin:', email);
    admin.auth().getUserByEmail(email).then((user) => {
     
      console.log('User retrieved from Firebase:', user.toJSON());
        return admin.auth().setCustomUserClaims(user.uid, customClaims).then(() => {
         
          res.json({ success: true });
        })
      
      
    })
  }
});

function isInitialAdmin(email) {
  const initialAdminEmails = ['tjdgns1256@gmail.com', 'anthony.shen11@gmail.com'];
  return initialAdminEmails.includes(email);
};


app.use(express.static(path.join(__dirname, '../client/build')));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });