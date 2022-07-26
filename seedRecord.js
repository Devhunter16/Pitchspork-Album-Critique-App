// I'll run this file one time to insert some initial db entries

// Importing our model from product.js
const Record = require('../models/recordModel');

// Importing mongoose because we'll need it
const mongoose = require('mongoose');

// Connecting mongoose to our db in mongodb because we need to save to our db
mongoose.connect('mongodb://localhost:27017/AlbumInventory')
    .then(console.log("App connected to MongoDB"))
    .catch(error => {
        console.log("Error connecting to MongoDB!");
        console.log(error);
    });

// Creating some initial database entries
const records = [
    new Record
        ({
            albumName: 'Shore',
            artistName: 'Fleet Foxes',
            genre: 'Folk Rock',
            rating: 9
        }),
    new Record
        ({
            albumName: 'Teen Dream',
            artistName: 'Beach House',
            genre: 'Alternative',
            rating: 9
        }),
    new Record
        ({
            albumName: 'Cave World',
            artistName: 'Viagra Boys',
            genre: 'Punk',
            rating: 8
        })
];

// Saving the newly created records
Record.insertMany(records)
    .then(res => {
        console.log('Products saved!')
        console.log(res)
    })
    .catch(error => {
        console.log('Error saving products!')
        console.log(error)
    })