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

// Requiring "ejs-mate" so that we can create a template
// for any part of our ejs files (like a header or footer)
// and then re-use that template in as many ejs files 
// as we want to avoid having to type the same thing over
// and over. ejs-mate is one of many ejs engines that can
// be downloaded as an npm package
const ejsMate = require("ejs-mate");

// Importing path provides us with useful functions to interact with file paths
const path = require('path');

// Importing express-session so we can use connect-flash which depends on it
const session = require('express-session');

// Importing connect-flash so we can flash messages in our ejs pages when
// a user creates a new album entry
const flash = require('connect-flash');

// Learn about resave and saveUninitialized here: https://www.npmjs.com/package/express-session,
// Setting these will remove some annoying deprecation warnings you get due to using express-session
// that you'll get in the console upon starting your server.
const sessionOptions = { secret: 'thisisnotagoodsecret', resave: false, saveUninitialized: false };

// Importing mongoose so I can use it to connect to mongodb
const mongoose = require('mongoose');

// Connecting mongoose to our "AlbumInventory" db in mongodb because we need to use it
mongoose.connect('mongodb://localhost:27017/AlbumInventory')
    .then(console.log("App connected to MongoDB"))
    .catch(error => {
        console.log("Error connecting to MongoDB!");
        console.log(error);
    });

// Here we're telling express that we want to use
// ejs-mate as our engine rather than the default one
// it is relying on
app.engine("ejs", ejsMate);

// This makes it so I can access the ejs files in the 'views' folder.
// Views will now be the base file when we use res.render
app.set('views', path.join(__dirname, 'views'));

// Setting the view engine to ejs
app.set('view engine', 'ejs');

// We need this built-in middlewhere function in Express.
// With it we can post nested objects with POST requests
app.use(express.urlencoded({ extended: true }));

// Telling our app we're going to be using express-session and passing
// in the express-session options we defined above. We need to do all
// of this to use connect-flash
app.use(session(sessionOptions));

// Telling our app that we'll be using connect-flash
app.use(flash());

// Some flash middleware
app.use((req, res, next) => {
    // Now we have access to res.locals. -->success<-- in all of our
    // ejs templates without having to pass it through in our routes
    res.locals.success = req.flash("success");
    // Same thing but with error this time
    res.locals.error = req.flash("error");
    // Calling next so that we don't break our app and don't get stuck
    // here with this middleware becoming the end-all, be-all
    next();
});

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

// Assigning the port # 3000 to the variable: "port"
const port = 3000;

// Confirms listening when the app is running in node.js 
app.listen(port, () => {
    console.log('Listening on Port 3000');
});

// App.all() is for every single request, the "*" parameter stand for 
// every path.
app.all("*", (req, res, next) => {
    // We're wrapping our error in next() so that it will hit our
    // generic error handler at the bottom of this file. This error
    // will then become the "err" parameter in that middleware
    // function
    next(new ExpressError("Page not found", 404));
});

// Error handler we created. See a ".use" function with four 
// parameters? That's error handling middleware.
app.use((err, req, res, next) => {
    // Destructuring the statusCode from whatever
    // ExpressError hits this error handler so we can display it
    // back to the user. We've given a default of "500" and
    // just in case.
    const { statusCode = 500 } = err;
    // Here we're saying if there is no error message attached to
    // our error already, this is going to be the default
    if (!err.message) err.message = "Oh no, something went wrong"
    // This sends our staus code to the console and renders our 
    // "error.ejs" page and passes our status code through
    res.status(statusCode).render("error", { err });
});