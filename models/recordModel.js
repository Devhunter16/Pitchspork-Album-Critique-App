// Importing and using mongoose to create a schema
const mongoose = require("mongoose");

// Destructuring Schema so we don't have to use mongoose.Schema and
// instead can just use Schema
const { Schema } = mongoose;

// Creating a Schema for an album
const productSchema = new Schema({
    albumName: { type: String, required: true },
    artistName: { type: String, required: true },
    genre: { type: String, required: true },
    rating: { type: Number, enum: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] },
    coverArtImg: String
});

// Compiling our schema into a model: "Record"
const Record = mongoose.model("Record", productSchema);

// Exporting our model to be used elsewhere
module.exports = Record;