// Importing and using mongoose to create a schema
const mongoose = require("mongoose");

// Creating our schema
const productSchema = new mongoose.Schema({
    albumName: { type: String, required: true },
    artistName: { type: String, required: true },
    genre: { type: String, required: true },
    rating: { type: Number, enum: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] }
});

// Compiling our schema into a model: "Record"
const Record = mongoose.model("Record", productSchema);

// Exporting our model to be used elsewhere
module.exports = Record;