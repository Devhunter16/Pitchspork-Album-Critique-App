const mongoose = require("mongoose");

// Destructuring Schema so we don't have to use mongoose.Schema and
// instead can just use Schema
const { Schema } = mongoose;

// Creating an "Artist" Schema so that we can have artists with 
// multiple albums and can display all of an Artist's albums on a 
// web page
const artistSchema = new Schema({
    name: {
        type: String,
        required: [true, "Artist must have a name!"]
    },
    albums: [
        {
            type: Schema.Types.ObjectId,
            ref: "Record"
        }
    ]
});

// Compiling our schema into a model: "Artist"
const Artist = mongoose.model("Artist", artistSchema);

// Exporting our model to be used elsewhere
module.exports = Artist;