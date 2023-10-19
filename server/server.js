


const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');

app.use(express.static(path.join(__dirname, '../client/build')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
