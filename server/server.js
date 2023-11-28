


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

  if (isInitialAdmin(email)) {
    admin.auth().getUserByEmail(email).then((userRecord) => {
      return admin.auth().setCustomUserClaims(userRecord.uid, customClaims).then(() => {
        res.json({ success: true });
      });
    }).catch((error) => {
      console.error('Error in setting admin role:', error);
      res.status(500).send('Error in setting admin role');
    });
  } else {
    res.status(400).send('Email is not recognized as an initial admin');
  }
});

app.post('/getUserRole', (req, res) => {
  const { email } = req.body;

  admin.auth().getUserByEmail(email).then((userRecord) => {
    const isAdmin = userRecord.customClaims && userRecord.customClaims.admin;
    res.json({ role: isAdmin ? 'admin' : 'member' });
  }).catch((error) => {
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal server error');
  });
});

const setEmailAsAdmin = async (email) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log('admin role set for ${email}');

  } catch (error) {
    console.error('error setting admin role: ', error);
  }
};

setEmailAsAdmin('tjdgns1256@gmail.com');


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