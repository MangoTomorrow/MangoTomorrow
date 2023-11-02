


const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const admin = require('firebase-admin');
const serviceAccount = require('~/ec2-user/cppLiftingClub/cppLiftingClubKey.json');
const { UserRecord } = require('firebase-admin/lib/auth/user-record');



app.use(express.static(path.join(__dirname, '../client/build')));


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });


firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://cppliftingclub.firebaseapp.com',
});


// set brian kang to admin
admin.auth().setCustomUserClaims('sjq7NvPoezMj01nvK1Di4fHIYh42', {admin: true});
// set anthony shen to admin
admin.auth().setCustomUserClaims('k5lytXLgRQROo7rU3Eiih1ew8Rt2', {admin: true});

// check user role
app.post('/checkUserRole', (req, res) => {
  const userId = req.body.userId;  //user id here will be sent by client to server to check role
  
  admin.auth().getUser(userId).then((UserRecord) => {
    // if user record and claim show admin = true then respond with 'admin' or 'member' if not
    if(UserRecord.customClaims && UserRecord.customClaims.admin === true) {
      res.json({role:'admin'});
    } else{
      res.json({role:'member'});
    }
  })
}).catch((error) => {
  //if user not found send error msg
  res.status(400).json({ error: 'user not found error'});
});