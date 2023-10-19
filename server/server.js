


const express = require('express');
const app = express();
const port = process.env.PORT || 8080;


app.use(express.static('build'));

app.get('/', (req, res) => {
    res.sendFile('build/index.html', {root: __dirname});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
