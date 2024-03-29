/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part 
*  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Dhruv Sahni Student ID: 143525228 Date: 11 March,2024

*  Cyclic Web App URL: https://fair-pear-bass-tam.cyclic.app/shop/3
* 
*  GitHub Repository URL: https://github.com/dhruvsahni2004/Assignment4.git
*
********************************************************************************/
const express = require("express");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars"); // Import Handlebars module
const path = require("path");
const storeService = require("./store-service");

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { deletePostById } = require('./store-service');

cloudinary.config({
  cloud_name: "dlktxcibp",
  api_key: "787174983966466",
  api_secret: "FbFv2Dea5uBBD8mNkii_L2O6mi0",
  secure: true,
});

const upload = multer();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Middleware to parse URL-encoded bodies (for forms)
app.use(express.urlencoded({ extended: true }));

// Register the formatDate helper
const formatDate = function (dateObj) {
  let year = dateObj.getFullYear();
  let month = (dateObj.getMonth() + 1).toString();
  let day = dateObj.getDate().toString();
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

// Register the formatDate helper
Handlebars.registerHelper("formatDate", formatDate);

// Register the safeHTML helper
Handlebars.registerHelper("safeHTML", function (options) {
  return new Handlebars.SafeString(options.fn(this));
});

// Middleware function for setting active routes and viewing categories
app.use(function (req, res, next) {
  let route = req.path.substring(1);
  app.locals.activeRoute =
    "/" +
    (isNaN(route.split("/")[1])
      ? route.replace(/\/(?!.)/, "")
      : route.replace(/\/(.)/, ""));
  app.locals.viewingCategory = req.query.category;
  next();
});

// Set up Handlebars engine with custom helpers
const hbs = exphbs.create({
  extname: ".hbs",
  helpers: {
    navLink: function (url, options) {
      return (
        '<li class="nav-item"><a ' +
        (url == app.locals.activeRoute
          ? ' class="nav-link active" '
          : ' class="nav-link" ') +
        ' href="' +
        url +
        '">' +
        options.fn(this) +
        "</a></li>"
      );
    },
    equal: function (lvalue, rvalue, options) {
      if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
      if (lvalue != rvalue) {
        return options.inverse(this);
      } else {
        return options.fn(this);
      }
    },
  },
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

// Serve static files from the 'public' folder
app.use(express.static("public"));

// Redirect "/" route to "/shop"
app.get("/", (req, res) => {
  res.redirect("/shop");
});

// Route setting for "/about"
app.get("/about", (req, res) => {
  res.render("about");
});

// Route setting for "/items/add"
app.get("/items/add", async (req, res) => {
  try {
    // Fetch categories from the store-service module
    const categories = await storeService.getCategories();
    
    // Render the addPost view with categories passed as data
    res.render("addPost", { categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    // If an error occurs, render the addPost view with an empty array for categories
    res.render("addPost", { categories: [] });
  }
});

// POST route for adding new items
app.post("/items/add", upload.single("featureImage"), (req, res) => {
  // Handle form submission here
  // Ensure you process the data and store it accordingly
});

// Route setting for "/categories/add"
app.get("/categories/add", (req, res) => {
  res.render("addCategory");
});

// POST route for adding new categories
app.post("/categories/add", (req, res) => {
  // Extract category data from the request body
  const categoryData = {
    name: req.body.name, // Assuming your form field for category name is named "name"
    description: req.body.description // Assuming your form field for category description is named "description"
    // Add more properties as needed
  };

  // Call the addCategory function from storeService to add the new category
  storeService.addCategory(categoryData)
    .then(() => {
      // Redirect to /categories after successfully adding the category
      res.redirect("/categories");
    })
    .catch((error) => {
      console.error("Error adding category:", error);
      // Send a 500 status code with an error message to the client if an error occurs
      res.status(500).send("Error adding category");
    });
});

// Route setting for deleting items by ID
app.get("/categories/delete/:id", (req, res) => {
  const categoryId = req.params.id;

  // Call the deleteCategoryById function from storeService to delete the category by ID
  storeService.deleteCategoryById(categoryId)
    .then(() => {
      // Redirect to /categories after successfully deleting the category
      res.redirect("/categories");
    })
    .catch((error) => {
      console.error("Error deleting category:", error);
      // Send a 500 status code with an error message to the client if an error occurs
      res.status(500).send("Unable to Remove Category / Category not found");
    });
});


// Route setting for deleting categories by ID
app.get("/items/delete/:id", (req, res) => {
  const itemId = req.params.id;

  // Call the deletePostById function from storeService to delete the item by ID
  storeService.deletePostById(itemId)
    .then(() => {
      // Redirect to /items after successfully deleting the item
      res.redirect("/items");
    })
    .catch((error) => {
      console.error("Error deleting item:", error);
      // Send a 500 status code with an error message to the client if an error occurs
      res.status(500).send("Unable to Remove Item / Item not found");
    });
});


// Unmatched route - 404 error
app.use(function (req, res) {
  res.render("404");
});


//setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);

  // Initialize the storeService
  storeService.initialize()
    .then(function (data) {
      console.log(data);
    })
    .catch(function (err) {
      console.log(err);
    });
}
app.get("/items/delete/:id", async (req, res) => {
  const postId = req.params.id; // Extract the post ID from the request parameters
  
  try {
    // Attempt to delete the post with the specified ID
    await deletePostById(postId);
    
    // If the deletion is successful, redirect the user to the "/items" view
    res.redirect("/items");
  } catch (error) {
    // If an error occurs, return a 500 status code and an error message
    console.error("Error deleting post:", error);
    res.status(500).send("Unable to Remove Post / Post not found");
  }
});

