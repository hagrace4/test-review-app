const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: {
      A: String,
      B: String,
      C: String,
      D: String
    },
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

const Question = mongoose.model('Question', questionSchema);


module.exports = Question;
module.exports = mongoose.model('Question', questionSchema);
