// I'll run this file one time to insert some initial db entries

// Importing our Record model from recordModel.js
const Record = require('../models/recordModel');

// Importing the Artist model from recordModel.js
const Artist = require('../models/artistModel');

// Importing mongoose because we'll need it
const mongoose = require('mongoose');

// Connecting mongoose to our db in mongodb because we need to save to our db
mongoose.connect('mongodb://localhost:27017/AlbumInventory')
    .then(console.log("App connected to MongoDB")
    )
    .catch(error => {
        console.log("Error connecting to MongoDB!");
        console.log(error);
    });

const seedDB = async () => {
    // Write the logic below so it wipes before adding entries

    // Deletes all entries in all collections every time this file is run
    await Record.deleteMany({}).then(console.log("All albums deleted."));
    await Artist.deleteMany({}).then(console.log("All artists deleted."));

    // Creating some initial albums as database entries
    const records = [
        new Record
            ({
                albumName: 'Shore',
                artistName: 'Fleet Foxes',
                genre: 'Folk',
                rating: 9,
                coverArtImg: 'https://lastfm.freetls.fastly.net/i/u/770x0/a3638eeb1bb4ffc5a8c12cf28e56ba0f.jpg#a3638eeb1bb4ffc5a8c12cf28e56ba0f.jpg'
            }),
        new Record
            ({
                albumName: 'Teen Dream',
                artistName: 'Beach House',
                genre: 'Alternative',
                rating: 9,
                coverArtImg: 'https://lastfm.freetls.fastly.net/i/u/770x0/a8af9bee825945a7a84acc6eb6bba298.jpg#a8af9bee825945a7a84acc6eb6bba298.jpg'
            }),
        new Record
            ({
                albumName: 'Cave World',
                artistName: 'Viagra Boys',
                genre: 'Punk',
                rating: 8,
                coverArtImg: 'https://lastfm.freetls.fastly.net/i/u/770x0/200a9c16025ea953cd378aeb44b8d6f8.jpg#200a9c16025ea953cd378aeb44b8d6f8.jpg'
            }),
        new Record
            ({
                albumName: 'Light Upon the Lake',
                artistName: 'Whitney',
                genre: 'Alternative',
                rating: 8,
                coverArtImg: 'https://lastfm.freetls.fastly.net/i/u/770x0/c1018c6d883cd35794c92d2dda92c380.jpg#c1018c6d883cd35794c92d2dda92c380.jpg'
            }),
        new Record
            ({
                albumName: 'Happening',
                artistName: 'Launder',
                genre: 'Alternative',
                rating: 7,
                coverArtImg: 'https://lastfm.freetls.fastly.net/i/u/770x0/864ba8b7aaa9313daf5d6a0b1c5791d0.jpg#864ba8b7aaa9313daf5d6a0b1c5791d0.jpg'
            }),
        new Record
            ({
                albumName: 'Infinite Granite',
                artistName: 'Deafheaven',
                genre: 'Metal',
                rating: 8,
                coverArtImg: 'https://lastfm.freetls.fastly.net/i/u/770x0/b756bb2bdf203a3d4b51d5bd0a9816fb.jpg#b756bb2bdf203a3d4b51d5bd0a9816fb.jpg'
            }),
        new Record
            ({
                albumName: 'Currents',
                artistName: 'Tame Impala',
                genre: 'Alternative',
                rating: 10,
                coverArtImg: 'https://lastfm.freetls.fastly.net/i/u/770x0/dd45b0438a315aed98b5830aa2fc43c5.jpg#dd45b0438a315aed98b5830aa2fc43c5.jpg'
            }),
    ];

    // Saving the newly created albums in our "records" MongoDB collection
    await Record.insertMany(records)
        .then(res => {
            console.log('Albums seeded.');
        })
        .catch(error => {
            console.log('Error saving products!');
            console.log(error);
        });

    // Creating some inital artist database entries
    const artists = [
        new Artist
            ({
                name: 'Fleet Foxes',
                albums: []
            }),
        new Artist
            ({
                name: 'Beach House',
                albums: []
            }),
        new Artist
            ({
                name: 'Viagra Boys',
                albums: []
            }),
        new Artist
            ({
                name: 'Whitney',
                albums: []
            }),
        new Artist({
            name: 'Launder',
            albums: []
        }),
        new Artist
            ({
                name: 'Deafheaven',
                albums: []
            }),
        new Artist
            ({
                name: 'Tame Impala',
                albums: []
            }),
    ];

    // for loop which pushes every new album we just created into the
    // albums list for the appropriate artist
    for (let i = 0; i < records.length; i++) {
        artists[i].albums.push(records[i]);
    }

    // Saving the newly created artists in our "artists" MongoDB collection
    await Artist.insertMany(artists)
        .then(res => {
            console.log('Artists seeded.');
        })
        .catch(error => {
            console.log('Error saving artists!');
            console.log(error);
        });

};

// Seeding our database then closing the Mongoose connection so we 
// don't have to manually close it ourselves.
seedDB()
    .then(() => {
        mongoose.connection.close();
    });
