const mongoose = require('mongoose');


//what is this schema doing?
// This code defines a Mongoose schema for a "Chat" model in a MongoDB database. The schema includes fields for the user who owns the chat, the title of the chat, and the last activity timestamp. It also sets up automatic timestamping for when each chat document is created and last updated.
const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    lastActivity: {
        type: Date,
        default: Date.now,
    },

}, { timestamps: true });

const chatModel = mongoose.model('Chat', chatSchema);
module.exports = chatModel;
