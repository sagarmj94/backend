const mongoose = require('mongoose');


//what is this schema doing?
// This code defines a Mongoose schema for a "User" model in a MongoDB database. The schema includes fields for the user's email, full name (with first and last names), and password. It also sets up automatic timestamping for when each user document is created and last updated.
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    },
    password: {
        type: String,
    },
},
    {
        timestamps: true
    }
);

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;