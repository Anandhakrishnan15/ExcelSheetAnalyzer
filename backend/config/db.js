// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/excelsheetanalyzer');
        console.log(`database conntion succesfull`);
    } catch (error) {
        console.error(`Error connecting to DB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;

