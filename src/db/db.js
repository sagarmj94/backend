const mongoose = require('mongoose');

async function connectDB() {

    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("connected  to mongoDB");
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }

}

module.exports = connectDB;