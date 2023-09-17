



const express = require('express');
const app = express();
const port = 48244;

app.get('/simpleAPI', (req, res) => {
    res.send('hello world');
});

app.listen(port, () => {
    console.log('Server listening to: ', port);
});

app.get('/Print_Hello_API', (req, res) =>{
    res.send('hello world, this is Anthony Shen');
})

//http://localhost:48244/simpleAPI