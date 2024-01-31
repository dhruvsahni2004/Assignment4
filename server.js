const express = require('express')
const path = require('path')
const app = express() //create an express application

const HTTP_PORT = process.env.PORT || 8080; // assign a port
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/home.html'));  
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

//Listen on port number
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
