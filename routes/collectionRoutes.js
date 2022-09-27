// This file is not completely necessary in order for our app to function,
// (it could easily all be in the index.js file) but it is nice to keep 
// routes in files like this for organizational purposes

const express = require('express');
const router = express.Router();

// Importing the Record model so that I can render db entries from my Mongodb "records" 
// collection in my ejs pages
const Record = require('../models/recordModel');

// Importing the Artist model so that I can render db entries from my Mongodb "artists" 
// collection in my ejs pages
const Artist = require('../models/artistModel');

// Importing the ExpressError class we created in the utilities
// folder so that we can use it in the code on this page
const ExpressError = require('../utilities/ExpressError');

// Importing the catchAsync function we created in the utilities
// folder so that we can wrap our async functions in it
const catchAsync = require('../utilities/catchAsync');


//This chunk of code causes issues, #FIXME
const { recordSchema } = require('../utilities/joiSchemas');

// FIXME this in conjunction with the joi schema is causing issues
// Creating a middleware function that contains server-side validation
// logic to make sure than no user can submit an empty form. 
const validateAlbumInput = (req, res, next) => {
    // If the input in the form is valid, then the error will be 
    // undefined. If the input is invalid, error is assigned a 
    // ValidationError object providing more information
    const { error } = recordSchema.validate(req.body);
    // If an error exists, we map over error.details which is an 
    // array of ValidationError objects, take every object and return
    // the error messages into a new array, then join those elements 
    // of the new array we created by comma into a new string. We 
    // save that string as the variable msg so we can display it to
    // the user by adding it as an argument to our ExpressError class
    if (error) {
        const msg = error.details.map(element => element.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        // We have to call next here so if there is no error we can
        // move past this rather than getting stuck here
        next();
    }
};


// This renders our "collection.ejs" page when we click the "Albums" link in the navbar
router.get('/', catchAsync(async (req, res) => {
    // Here we find all of our albums and store them in the "records" array
    const records = await Record.find({});
    // Here we find all of our artists and store them in the "artists" array
    const artists = await Artist.find({});
    // The "sort()" method allows us to put in a callback function
    // as a parameter. The function we created accepts two parameters,
    // "a", and "b". These will be two elements from the "records" array.
    // The sort method will cycle through the array accepting two elements.
    records.sort(function (a, b) {
        // If b should come before a, returns a negative number. If a should
        // come before b, returns a positive number, if both are equal, returns
        // 0. This sorts the array "records" by rating.
        return b.rating - a.rating;
    });
    // Here I'm sorting the artists in the array alphabetically by name
    for (let i = 0; i < records.length - 1; i++) {
        if (records[i].artistName == records[i + 1].artistName) {
            if (records[i].albumName > records[i + 1].albumName) {
                [records[i], records[i + 1]] = [records[i + 1], records[i]];
            }
        }
    };
    // Passing through records, artists, and our flash messages that we defined
    // in our POST and PUT routes below.
    res.render('pages/collection', { records, artists, messages: req.flash("addedAlbum") })
}));

// PUT request to update an album's info. We are including the middleware
// function validateAlbumInput() as an argument in order to use it in this
// route handler so that we have server-side validation in case a user 
// somehow makes it past our bootstrap client-side validation. We don't need to call
// it within the route handler, we can just add is as an argument
// and it'll work
router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    // Finds the record by it's ID and updates it's info
    await Record.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    // Using flash to flash this message after we update a entry
    // and before we're redirected to our collection.ejs page
    req.flash("success", `Album updated!`)
    // Brings us back to the "collection.ejs" page
    res.redirect('/collection');
}));

// This posts all of the info you input into the form on the "updateCollection.ejs" 
// page and then dumps you out at the "collection.ejs" page
router.post('/', catchAsync(async (req, res) => {
    // req.body are all of the keys and values you just submitted in the form
    const newRecord = new Record(req.body);
    await newRecord.save();
    // Boolean value we need for the if, then logic below
    let foundArtist = false;
    // Finding all artists in our collection and creating the "artists"
    // array with them
    const artists = await Artist.find({});
    // This for loop goes through the "artists" array looking for an
    // artist with a name that matches the artist name for the album,
    // if it finds a match, it adds the new album to the existing artist's 
    // array of albums
    for (let i = 0; i < artists.length; i++) {
        if (artists[i].name === newRecord.artistName) {
            artists[i].albums.push(newRecord);
            console.log("Found matching artist");
            await artists[i].save();
            foundArtist = true;
        }
    };
    // If the for loop above didn't find a match, this creates a new
    // artist and adds the album to that artist's array of albums
    if (foundArtist == false) {
        // Creating a new artist based on what the user entered in the
        // artistName field on the form
        const newArtist = new Artist({
            name: newRecord.artistName,
            albums: []
        });
        newArtist.albums.push(newRecord);
        // Saving the newly created artist in our "artists" collection in
        // MongoDB
        await newArtist.save();
    };
    // Using flash to flash this message after we create a new entry
    // and before we're redirected to our collection.ejs page
    req.flash("success", `New album added!`)
    // Brings us back to the "collection.ejs" page
    res.redirect('collection/');
}));

// DELETE request for a single album
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    // Here we await the deletion of the record
    const deletedRecord = await Record.findByIdAndDelete(id);
    const artists = await Artist.find({});
    // This for loop goes through the "artists" array and removes the
    // album we just deleted from that artist's list of albums.
    for (let i = 0; i < artists.length; i++) {
        if (artists[i].name === deletedRecord.artistName) {
            artists[i].albums.remove(deletedRecord);
            await artists[i].save();
        }
    };
    // Now we redirect to the "All Albums and Ratings" page
    res.redirect('/collection');
}));

// Exporting all of our routes
module.exports = router