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

// Importing the catchAsync function we created in the utilities
// folder so that we can wrap our async functions in it
const catchAsync = require('../utilities/catchAsync');

// This renders the home page
router.get('/', (req, res) => {
    res.render('pages/index');
});

// This renders our "bestAlbums.ejs" page when we click the "Best Albums" link in the navbar
router.get('/bestAlbums', catchAsync(async (req, res) => {
    const records = await Record.find({});
    const artists = await Artist.find({});
    records.sort(function (a, b) {
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
    res.render('pages/bestAlbums', { records, artists })
}));

// This renders the "updateCollection.ejs" form page when we click the "Add Album" link in the navbar
router.get('/updateCollection', catchAsync(async (req, res) => {
    const { id } = req.params;
    const record = await Record.find(id);
    res.render('pages/updateCollection', { record })
}));

// This renders our "viewInfo.ejs" page based on which album name you click on
router.get('/viewInfo/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    // Finding the record based on it's id
    const record = await Record.findById(id);
    // Finding all of our artists
    const artists = await Artist.find({});
    // Rendering our "viewInfo" page and passing our record and artists info to it
    res.render('pages/viewInfo', { record, artists })
}));

// This renders the "editInfo.ejs" page when you click the edit button on an 
// album's "viewInfo.ejs" page
router.get('/editInfo/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const record = await Record.findById(id);
    res.render('pages/editInfo', { record })
}));

// This renders rgw "showArtist" page based on the name of the artist you clicked on
router.get('/showArtist/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    // Here we're populating the albums array for the artist because
    // until we do that it is just an array of album ids. Once we 
    // pupulate it we can use all of the album information for each 
    // album in our ejs page
    const artist = await Artist.findById(id).populate('albums');
    const records = await Record.find({});
    // Sorting the artist's albums alphabetically
    artist.albums.sort((a, b) => a.albumName.localeCompare(b.albumName));
    res.render('pages/showArtist', { artist, records })
}));

// Exporting all of our routes
module.exports = router