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
const mongoose = require('mongoose');

// Importing the Record model so that I can render db entries in my ejs pages
const Record = require('./models/recordModel');

// Importing the Artist model
const Artist = require('./models/artistModel');

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
    // Here we find all of our albums and store them in the "records" array
    const records = await Record.find({});
    // Here we find all of our artists and store them in the "artists" array
    const artists = await Artist.find({});
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

// This renders our "artists.ejs" page when we click the "Artists" link in the navbar
app.get('/artists', async (req, res) => {
    // Here we find all of our artists and store them in the "artists" array
    const artists = await Artist.find({});
    // Here I'm sorting the "artists" array alphabetically by name
    artists.sort((a, b) => a.name.localeCompare(b.name));
    res.render('pages/artists', { artists })
});

// This renders our "Best Albums" page when we click the "Best Albums" link on the homepage
app.get('/bestAlbums', async (req, res) => {
    const records = await Record.find({});
    const artists = await Artist.find({});
    // I've already explained this part above
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
    // Findong all of our artists
    const artists = await Artist.find({});
    // Rendering our "viewInfo" page and passing our record info to it
    res.render('pages/viewInfo', { record, artists })
});

// This renders an "Edit Record Info" page based on the name of the album you clicked on
app.get('/editInfo/:id', async (req, res) => {
    const { id } = req.params;
    const record = await Record.findById(id);
    res.render('pages/editInfo', { record })
});

// This renders an "Show Artist Info" page based on the name of the artist you clicked on
app.get('/showArtist/:id', async (req, res) => {
    const { id } = req.params;
    // Here we're populating the albums array for the artist because
    // until we do that it is just an array of album ids. Once we 
    // pupulate it we can use all of the album information for each 
    // album
    const artist = await Artist.findById(id).populate('albums');
    const records = await Record.find({});
    // Sorting the artist's albums alphabetically
    artist.albums.sort((a, b) => a.albumName.localeCompare(b.albumName));
    res.render('pages/showArtist', { artist, records })
});

app.put('/collection/:id', async (req, res) => {
    const { id } = req.params;
    // Finds the record by it's ID and updates it's info
    await Record.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    // Brings us back to the "All Album Ratings" page
    res.redirect('/collection');
});

// This posts all of the info you input into the form on the "updateCollection.ejs" 
// page and then dumps you out at the "collection.ejs" page
app.post('/collection', async (req, res) => {
    // req.body are allof  the keys and values you just submitted in the form
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
    // artist and adds the ablum to that artist's array or albums
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

app.delete('/artists/:id', async (req, res) => {
    const { id } = req.params;
    // Here we await the deletion of the record and then log the deleted record in the console
    const artist = await Artist.findById(id);
    // Here we are checking whether or not the artist has any albums in
    // the arists's "albums" array, and if so we delete them all
    if (artist.albums.length) {
        const res = await Record.deleteMany({ _id: { $in: artist.albums } });
        console.log(res);
    }
    // Now we're deleting the artist
    await Artist.findByIdAndDelete(id);
    // Now we redirect to the "All Albums and Ratings" page
    res.redirect('/artists');
});

app.delete('/collection/:id', async (req, res) => {
    const { id } = req.params;
    // Here we await the deletion of the record and then log the deleted record in the console
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

// lastFM API key 6759f7a3d41ce0704cc47402e3b25b41
// lastFM shared secret 7f66376d8c2f54805911ce097f3ec61e