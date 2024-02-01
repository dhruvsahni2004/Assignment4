/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Rajkaran Singh
Student ID: 145675229
Date: 31 january,2024
Cyclic Web App URL: https://dull-teal-meerkat-garb.cyclic.app/
GitHub Repository URL: https://github.com/rajkaranxgill/web322-app

********************************************************************************/ 

const express = require('express');
const path = require('path');
const storeService = require('./store-service');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.redirect('/about');
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/about.html'));
});

app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));
});

app.get('/items', (req, res) => {
    storeService.getAllItems()
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));
});

app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then(data => res.json(data))
        .catch(error => res.json({ message: error }));
});

app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

storeService.initialize()
    .then(() => {
        app.listen(HTTP_PORT, () => console.log(`Express http server listening on port ${HTTP_PORT}`));
    })
    .catch((error) => {
        console.error(`Initialization failed: ${error}`);
    });
