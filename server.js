/*********************************************************************************
*  WEB322 – Assignment 03
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Rajkaran Singh Student ID: 145675229 Date: 15 February,2024

*  Cyclic Web App URL: https://dull-teal-meerkat-garb.cyclic.app/
* 
*  GitHub Repository URL: https://github.com/rajkaranxgill/web322-app
*
********************************************************************************/ 
 
const express = require("express")
const app = express() 
const HTTP_PORT = process.env.PORT || 8080;
const path = require('path');
const storeService = require('./store-service');
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

          
cloudinary.config({ 
  cloud_name: 'dlktxcibp', 
  api_key: '787174983966466', 
  api_secret: 'FbFv2Dea5uBBD8mNkii_L2O6mi0' 
});

const upload = multer(); 

app.post('/items/add', upload.single('featureImage'), (req, res) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function uploadToCloudinary(req) {
      try {
        let result = await streamUpload(req);
        console.log(result);
        processItem(result.secure_url);
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        processItem('');
      }
    }

    uploadToCloudinary(req);
  } else {
    processItem('');
  }

  function processItem(imageUrl) {
    req.body.featureImage = imageUrl;

    storeService.addItem(req.body)    
      .then(() => {
        res.redirect('/items');
      })
      .catch(error => {
        console.error('Error adding item:', error);
        res.status(500).send('Error adding item');
      });
  }
});

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.redirect('/about');
  });

app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
  });

app.get('/items/add', (req, res) => {
  res.sendFile(__dirname + '/views/addItem.html');
});


app.get('/shop', function (req, res) {
    storeService.getPublishedItems()
        .then(data => res.json(data))
        .catch(err => res.json({message: err}));
});
  
app.get('/items', (req, res) => {
     const { category, minDate } = req.query;

     if (category) {
         storeService.getItemsByCategory(category)
             .then(data => res.json(data))
             .catch(err => res.json({ message: err }));
     }
     else if (minDate) {
         storeService.getItemsByMinDate(minDate)
             .then(data => res.json(data))
             .catch(err => res.json({ message: err }));
     }
     else {
         storeService.getAllItems()
             .then(data => res.json(data))
             .catch(err => res.json({ message: err }));
     }
  });

app.get('/item/:id', (req, res) => {
  const itemId = req.params.id;

  storeService.getItemById(itemId)
      .then(item => {
          if (item) {
              res.json(item);
          } else {
              res.status(404).json({ message: 'Item not found' });
          }
      })
      .catch(err => res.status(500).json({ message: err }));
});


 app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then(data => res.json(data))
        .catch(err => res.json({message: err}));
  });




app.listen(HTTP_PORT, onHttpStart);

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
    
    return storeService.initialize()
        .then(function (data) {
            console.log(data);
        })
        .catch(function (err) {
            console.log(err);
        });
}