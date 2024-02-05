const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Succesfully connected to DDBB");
  } catch (err) {
    console.log("An error occurred while connecting to DDBB ->", err);
  }
}

module.exports = connectDB;
