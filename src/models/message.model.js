const mongoose = require("mongoose");


//what is this schema doing?
// This code defines a Mongoose schema for a "Message" model in a MongoDB database. The schema includes fields for the user who sent the message, the chat to which the message belongs, the content of the message, and the role of the sender (user, model, or system). It also sets up automatic timestamping for when each message document is created and last updated.
const messageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat",
    },
    content: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["user", "model", "system"],
        default: "user",
    },
}, {
    timestamps: true
});

const messageModel = mongoose.model("message", messageSchema);

module.exports = messageModel;