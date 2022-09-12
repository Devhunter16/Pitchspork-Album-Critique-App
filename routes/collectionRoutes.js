// This file is not completely necessary in order for our app to function,
// but it is nice to keep routes in files like this for organizational
// purposes

const express = require('express');
const router = express.Router();

// Importing the Record model so that I can render db entries from my Mongodb "records" 
// collection in my ejs pages
const Record = require('../models/recordModel');

// Importing the Artist model so that I can render db entries from my Mongodb "artists" 
// collection in my ejs pages
const Artist = require('../models/artistModel');

// This renders our "collection.ejs" page when we click the "Albums" link in the navbar
router.get('/', async (req, res) => {
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
    res.render('pages/collection', { records, artists })
});

// PUT request to update an album's info
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    // Finds the record by it's ID and updates it's info
    await Record.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    // Brings us back to the "collection.ejs" page
    res.redirect('/collection');
});

// This posts all of the info you input into the form on the "updateCollection.ejs" 
// page and then dumps you out at the "collection.ejs" page
router.post('/', async (req, res) => {
    // req.body are all of the keys and values you just submitted in the form
    const newRecord = new Record(req.body);
    await newRecord.save();
    // Boolean value we need for the if, then logic below
    foundArtist = false;
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
    // Brings us back to the "collection.ejs" page
    res.redirect('collection/');
});

// DELETE request for a single album
router.delete('/:id', async (req, res) => {
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
});

// Exporting all of our routes
module.exports = router