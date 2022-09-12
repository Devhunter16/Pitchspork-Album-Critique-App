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

// This renders our "artists.ejs" page when we click the "Artists" link in the navbar
router.get('/', async (req, res) => {
    // Here we find all of our artists and store them in the "artists" array
    const artists = await Artist.find({});
    // Here I'm sorting the "artists" array alphabetically by name
    artists.sort((a, b) => a.name.localeCompare(b.name));
    res.render('pages/artists', { artists })
});

// DELETE request to delete an artist and all of their albums
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const artist = await Artist.findById(id);
    // Here we are checking whether or not the artist has any albums in
    // the artist's "albums" array, and if so we delete them all
    if (artist.albums.length) {
        const res = await Record.deleteMany({ _id: { $in: artist.albums } });
        console.log(res);
    }
    // Now we're deleting the artist
    await Artist.findByIdAndDelete(id);
    // Now we redirect to the "artists.ejs" page
    res.redirect('/artists');
});

// Exporting all of our routes
module.exports = router