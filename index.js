// Importing and assigning express to variable "app"
const express = require('express');
const app = express();

// Importing method-override middleware to use "PUT" or 
// "DELETE" requests in places where the client doesn't 
// support it, like in our .ejs pages.
const methodOverride = require('method-override');

// Path provides us with useful functions to interact with file paths
const path = require('path');

// Importing mongoose so I can use it to connect to mongodb
const mongoose = require("mongoose");

// Importing the Record model so that I can render db entries in my ejs pages
const Record = require('./models/recordModel');

// Connecting mongoose to our db in mongodb because we need to use our db
mongoose.connect('mongodb://localhost:27017/AlbumInventory')
    .then(console.log("App connected to MongoDB"))
    .catch(error => {
        console.log("Error connecting to MongoDB!");
        console.log(error);
    });

// This makes it so I can access the ejs files in the 'views' folder.
// Views will now be the base file when we use res.render
app.set('views', path.join(__dirname, 'views'));

// Setting the view engine to ejs
app.set('view engine', 'ejs');

// We need this built-in middlewhere function in Express.
// With it we can post nested objects with POST requests.
app.use(express.urlencoded({ extended: true }));

// Assigning the port # to the variable: "port"
const port = 3000;

// Using our express middleware "method-override" that we
// imported. The '_method' parameter lets us override 
// methods with a query string like this: /?_method=DELETE. 
// For an example check out the delete button on the 
// vieInfo.ejs page
app.use(methodOverride('_method'));

// Confirms listening when the app is running in node.js 
app.listen(port, () => {
    console.log('Listening on Port 3000');
});

// This renders the home page
app.get('/', (req, res) => {
    res.render('pages/index');
});

// This renders our "Collection" page when we click the "All Album Ratings" link on the homepage
app.get('/collection', async (req, res) => {
    // Here we find all of our objects and store them in the "records" array
    const records = await Record.find({});
    // The "sort()" method allows us to put in a callback function
    // as a parameter. The function we created accepts two parameters,
    // "a", and "b". These will be two elements from the "records" array.
    // The sort method will cycle through the array accapting two elements.
    records.sort(function (a, b) {
        // If b should come before a, returns a negative number. If a should
        // come before b, returns a positive number, if both are equal, returns
        // 0. This sorts the array "records" by rating.
        return b.rating - a.rating;
    });
    res.render('pages/collection', { records })
});

// This renders our "10" page when we click the "10" link on the homepage
app.get('/10', async (req, res) => {
    const records = await Record.find({});
    res.render('pages/10', { records })
});

// This renders our "9" page when we click the "9" link on the homepage
app.get('/9', async (req, res) => {
    const records = await Record.find({});
    res.render('pages/9', { records })
});

// This renders our "8" page when we click the "8" link on the homepage
app.get('/8', async (req, res) => {
    const records = await Record.find({});
    res.render('pages/8', { records })
});

// This renders our "7" page when we click the "7" link on the homepage
app.get('/7', async (req, res) => {
    const records = await Record.find({});
    res.render('pages/7', { records })
});

// This renders our "6" page when we click the "6" link on the homepage
app.get('/6', async (req, res) => {
    const records = await Record.find({});
    res.render('pages/6', { records })
});

// This renders our "5" page when we click the "5" link on the homepage
app.get('/5', async (req, res) => {
    const records = await Record.find({});
    res.render('pages/5', { records })
});

// This renders our "4" page when we click the "4" link on the homepage
app.get('/4', async (req, res) => {
    const records = await Record.find({});
    res.render('pages/4', { records })
});

// This renders our "3" page when we click the "3" link on the homepage
app.get('/3', async (req, res) => {
    const records = await Record.find({});
    res.render('pages/3', { records })
});

// This renders our "2" page when we click the "2" link on the homepage
app.get('/2', async (req, res) => {
    const records = await Record.find({});
    res.render('pages/2', { records })
});

// This renders our "1" page when we click the "1" link on the homepage
app.get('/1', async (req, res) => {
    const records = await Record.find({});
    res.render('pages/1', { records })
});

// This renders our "Best Albums" page when we click the "Best Albums" link on the homepage
app.get('/bestAlbums', async (req, res) => {
    const records = await Record.find({});
    // I've already explained this part above
    records.sort(function (a, b) {
        return b.rating - a.rating;
    });
    res.render('pages/bestAlbums', { records })
});

// This renders the "Create Entry" form page when we click the "Add Entry" link on the "All Albums and Ratings" page
app.get('/updateCollection', async (req, res) => {
    const { id } = req.params;
    const record = await Record.find(id);
    res.render('pages/updateCollection', { record })
});

// This renders our "View Album Info" page based on which album name you click on
app.get('/viewInfo/:id', async (req, res) => {
    const { id } = req.params;
    // Finding the record based on it's id
    const record = await Record.findById(id);
    // Rendering our "viewInfo" page and passing our record info to it
    res.render('pages/viewInfo', { record })
});

// This renders an "Edit Record Info" page based on the name of the album you clicked on
app.get('/editInfo/:id', async (req, res) => {
    const { id } = req.params;
    const record = await Record.findById(id);
    res.render('pages/editInfo', { record })
});

app.put('/collection/:id', async (req, res) => {
    const { id } = req.params;
    // Finds the record by it's ID and updates it's info
    await Record.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    // Brings us back to the "All Album Ratings" page
    res.redirect('/collection');
});

// This posts all of the info you input into the form on the updateCollection page and then dumps you out 
// at the "All Album Ratings" page
app.post('/collection', async (req, res) => {
    // req.body are all the keys and values you just submitted with the submit button
    const newRecord = new Record(req.body);
    await newRecord.save();
    // Brings us back to the "All Album Ratings" page
    res.redirect('collection/');
});

app.delete('/collection/:id', async (req, res) => {
    const { id } = req.params;
    // Here we await the deletion of the record and then log the deleted record in the console
    const deletedRecord = await Record.findByIdAndDelete(id);
    console.log(deletedRecord);
    // Now we redirect to the "All Albums and Ratings" page
    res.redirect('/collection');
});