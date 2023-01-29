const mongoose = require("mongoose")

const Candidate = new mongoose.Schema({
  image: {
    type: String,
    required: false,
  },
  text: {
    type: String,
    required: true,
  },
})

const VoteSchema = new mongoose.Schema({
  ballot: [Candidate],
  category: {
    type: String,
    required: true,
  },
  creatorName: {
    type: String,
    required: true,
  },
  creatorId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  subcategory: {
    type: String,
    required: true,
  },
  timeframe: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model("vote", VoteSchema)
