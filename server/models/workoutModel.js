const mongoose = require('mongoose')

const Schema = mongoose.Schema

const workoutSchema = new Schema({
  style: {
    type: String,
    required: true
  },
  laps: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Workout', workoutSchema)