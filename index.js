// Importing and assigning express to the variable "app"
const express = require('express');
const app = express();

// Importing all of our routing from our routing js files
const collectionRoutes = require('./routes/collectionRoutes');
const artistRoutes = require('./routes/artistRoutes');
const allOtherRoutes = require('./routes/allOtherRoutes');


// Importing method-override middleware to use "PUT" or 
// "DELETE" requests in places where the client doesn't 
// support it, like in our .ejs pages.
const methodOverride = require('method-override');

// Importing path provides us with useful functions to interact with file paths
const path = require('path');

// Importing mongoose so I can use it to connect to mongodb
const mongoose = require('mongoose');

// Importing the Record model so that I can render db entries from my Mongodb "records" 
// collection in my ejs pages
const Record = require('./models/recordModel');

// Importing the Artist model so that I can render db entries from my Mongodb "artists" 
// collection in my ejs pages
const Artist = require('./models/artistModel');

// Connecting mongoose to our "AlbumInventory" db in mongodb because we need to use it
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
// With it we can post nested objects with POST requests
app.use(express.urlencoded({ extended: true }));

// Assigning the port # 3000 to the variable: "port"
const port = 3000;

// Using our express middleware "method-override" that we
// imported earlier. The '_method' parameter lets us override 
// methods with a query string like this: /?_method=DELETE. 
// For an example check out the delete button on the 
// vieInfo.ejs page
app.use(methodOverride('_method'));

// This tells our app to use the routes in our routing js files,
// we've already required these routes but requiring them is not
// enough. Requiring these routes basically makes it so we don't
// have to write /collection/whatever in our routes any more and 
// instead can omit the /collection part. It is also good to keep
// routes in seperate files if poossible for organizational purposes.
app.use('/collection', collectionRoutes);
app.use('/artists', artistRoutes);
app.use('/', allOtherRoutes);

// Confirms listening when the app is running in node.js 
app.listen(port, () => {
    console.log('Listening on Port 3000');
});
