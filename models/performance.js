// performance.js
const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  questionsAnswered: {
    type: Number,
    default: 0,
  },
  correctAnswers: {
    type: Number,
    default: 0,
  },
  incorrectAnswers: {
    type: Number,
    default: 0,
  },
});

const Performance = mongoose.model('Performance', performanceSchema);

module.exports = Performance;
