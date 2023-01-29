const mongoose = require("mongoose")
const config = require("config")

const mongoURI = config.get("mongoURI")

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false)
    await mongoose.connect(mongoURI)
    console.log("MongoDB connected")
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

module.exports = connectDB
