// Requiring "joi". This npm package will give us some tools
// for easy data validation in the forms in our "new.ejs" and
// "edit.ejs" pages. Joi is not Express-specific, it is just a 
// Javascript validator tool
const Joi = require('joi');

// You will only see the confusing chunk of code below in action
// if you somehow make it past the client-side validation we 
// created using bootstrap (check out the explanation on the 
// "new.ejs" page if you have questions), so this server-side 
// validation we created below is basically a backup plan for that. 

// The code below uses joi, which we imported above. We're using
// joi because it's much easier to validate forms with joi rather
// than writing a bunch of "if the user didn't put in a price, 
// then..." and "if the user didn't put in a description, 
// then...")-type logic for every field in our form. Joi also
// makes it easier to scale our model in case we want to add
// extra fields in the future. Visit https://joi.dev/api/?v=17.6.0
// to view the docs

// Here we are defining a basic schema with joi for the req.body,
// which is essentially an object that includes all of the fields in 
// our form. Note that this is NOT a Mongoose schema. This is 
// going to validate our data before it even makes it to 
// Mongoose because we do not want Mongoose to be saving entries
// with missing fields to our MongoDB database
module.exports.recordSchema = Joi.object({
    // If we look at our code in the "new.ejs" or "edit.ejs"
    // files, we'll see that the name of every input field is 
    // "campground[something]". This means that every input is 
    // being sent under "campground". Here we are making sure 
    // the campground object we're sending all of our form information
    // under is present by requiring it, and we're also making 
    // sure that every field within that object has been filled
    // out and is the correct type. We also set a price minimum
    // of 0
    record: Joi.object({
        artistName: Joi.string().required(),
        genre: Joi.string().required(),
        rating: Joi.number().required().min(0).max(10),
        coverArtImg: Joi.string()
    }).required()
});

// This validation method causes issues, #FIXME